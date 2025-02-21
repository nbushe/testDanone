import React, { useEffect, useMemo, useState } from "react";
import DataTable from "./components/DataTable";
import LineChart from "./components/LineChart";
import { fetchSensorData, fetchSensorSummary } from "./services/api";
import { Box, Divider, LinearProgress, Typography } from "@mui/material";
import Summary from "./components/Summary";
import { XmlSaveToServer } from "./components/XmlSaveToServer";
import IntervalPicker from "./components/IntervalPicker";
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import AppLayout from "./components/AppLayout";
import { constructNow, format } from "date-fns";
import { ru } from 'date-fns/locale';
import Sidebar from "./components/Sidebar";
import {

  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { SensorsCache, cacheHelpers } from "./services/cache";
import { SensorData } from "./misc/SensorData";
import axios from "axios";

const App: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorsCache>({});
  const [chartData, setChartData] = useState<SensorsCache>({});
  const [summaryData, setSummaryData] = useState<any>({});
  const [cache, setCache] = useState<SensorsCache>({});
  const [progress, setProgress] = useState(0);
  const BATCH_SIZE = 5;

  const { startDate, endDate } = useSelector((state: RootState) => state.interval);
  const [isTableExpanded, setIsTableExpanded] = useState(false); // Состояние для раскрытия таблицы

  const addDataToCache = (data: SensorData[]) => {

    setCache(prevCache => {
      const newCache = cacheHelpers.addData(prevCache, data);
      return newCache;
    });
  }

  const intervalCache = useMemo(() => {
    if (!startDate || !endDate) return {};
    return cacheHelpers.getRange(cache, startDate, endDate);
  }, [cache, startDate, endDate]);

  // Срабатывает при каждом изменении cache
  useEffect(() => {
    setSensorData(intervalCache);
    setChartData(intervalCache);
  }, [intervalCache]);

  // Вызывается при первом рендере компонента
  useEffect(() => {
    const fetchNewData = async (start: string, end: string) => {
      try {
        // Получаем данные с сервера
        const axiosResponse = await fetchSensorData(start ?? "", end ?? "");

        // Добавляем данные в кэш
        axiosResponse?.data && addDataToCache(axiosResponse?.data);

      } catch (error) {
        console.error("Ошибка при получении данных реального времени:", error);
      }
    }
    const fetchNewDataWrapper = async () => {
      const start = new Date(Date.now() - 10 * 1000).toISOString()
      const end = new Date(Date.now() + 30 * 1000).toISOString()
      await fetchNewData(start, end);
    }

    // Устанавливаем интервал для повторного запроса данных
    const intervalId = setInterval(fetchNewDataWrapper, 5000);
    fetchNewDataWrapper()

    // При разрушении компонента удаляем интервал
    return () => clearInterval(intervalId);

  }, [])

  // Вспомогательные функции
  const generateMinuteIntervals = (start: Date, end: Date): Date[] => {
    const intervals: Date[] = [];
    let current = new Date(start);
    current.setSeconds(0, 0);

    while (current < end) {
      intervals.push(new Date(current));
      current = new Date(current.getTime() + 60000);
    }
    return intervals;
  };

  // Вспомогательные функции
  const fetchMinuteData = async (minute: Date, controller: AbortController) => {
    try {
      const start = minute.toISOString();
      const end = new Date(minute.getTime() + 60000).toISOString();

      console.log(`[FETCH] Загрузка: ${start} - ${end}`);
      const response = await fetchSensorData(start, end, {
        signal: controller.signal
      });

      console.log(`[FETCH] Успешно: ${start}`, response?.data?.length || 0);
      return response?.data || [];
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(`[FETCH] Отменено: ${minute.toISOString()}`);
      } else {
        console.error(`[FETCH ERROR] ${minute.toISOString()}:`, error);
      }
      return null;
    }
  };

  // 2. Обновленный useEffect

  // Эффект для загрузки данных
  useEffect(() => {

    const fetchSummary = async () => {
      if (!startDate || !endDate) return;
      const summaryResponse = (await fetchSensorSummary(startDate ?? "", endDate ?? ""))?.data;
      setSummaryData(summaryResponse);
    }
    fetchSummary();

    const abortController = new AbortController();
    let isMounted = true;
    let totalBatches = 0;
    let completedBatches = 0;

    const fetchData = async () => {
      try {
        if (!startDate || !endDate) return;

        console.log('[PROGRESS] Начало загрузки данных');
        setProgress(0);

        // Генерация интервалов
        const minutes = generateMinuteIntervals(new Date(startDate), new Date(endDate));
        const minutesToFetch = minutes.filter(minute => {
          const key = minute.toISOString();
          return (cache[key]?.length || 0) < 30;
        });

        if (minutesToFetch.length === 0) {
          setProgress(100);
          return;
        }

        totalBatches = Math.ceil(minutesToFetch.length / BATCH_SIZE);

        // Пакетная загрузка
        for (let i = 0; i < minutesToFetch.length; i += BATCH_SIZE) {
          if (!isMounted) break;

          const batch = minutesToFetch.slice(i, i + BATCH_SIZE);
          const results = await Promise.all(
            batch.map(minute =>
              fetchMinuteData(minute, abortController)
            )
          );
          // Обработка результатов
          const newData = results.flat().filter(Boolean) as SensorData[];
          console.log(`[BATCH] Получено ${newData.length} записей`);

          if (newData.length > 0) {
            addDataToCache(newData); // <-- Используем исправленную функцию
            console.log(`[CACHE] Добавлено ${newData.length} записей`);

            // 4. Явное обновление состояния графика
            setChartData(intervalCache);

          }
          // Обновление прогресса
          completedBatches++;
          const newProgress = Math.min(
            Math.round((completedBatches / totalBatches) * 100),
            100
          );
          setProgress(newProgress);
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        if (isMounted) {
          setProgress(prev => Math.max(prev, 100));
          console.log('[PROGRESS] Загрузка завершена');
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
      console.log('[CLEANUP] Отмена загрузки');
    };
  }, [startDate, endDate]);


  return (
    <AppLayout>
      <Sidebar />
      <Box id="home" p={2} >
        <center>
          <Typography variant="h4" align="center" padding={"0px"} paddingBottom="30px">Мониторинг данных датчиков</Typography>
          {/* <UploadForm /> */}

          <Box id="chart"
            sx={
              {
                border: "1px solid #dfdfdf",
                borderRadius: "15px",
                backgroundColor: "#fefeef"
              }
            }>

            {progress < 100 &&
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                  {`Загружено: ${progress}%`}
                </Typography>
              </Box>
            }

            <Typography variant="h6" lineHeight="1" align="center" padding={"30px"} paddingBottom="30px">График данных датчиков</Typography>
            <LineChart cache={chartData} />
            <Typography variant="subtitle1" padding={"40px"} lineHeight="1" align="center"  >
              {`График построен в интервале с ${format(startDate ?? constructNow(""), 'dd MMMM yyyy, HH:mm:ss.SSS', { locale: ru })}`}
              {`   -      по ${format(endDate ?? constructNow(""), 'dd MMMM yyyy, HH:mm:ss.SSS', { locale: ru })}`}
            </Typography>
            <Box id="" sx={
              {
                borderTop: "1px solid #dfdfdf", // #1976d2
                borderRadius: "15px",
                padding: "20px",
                paddingBottom: "30px",
                backgroundColor: "#efeffe"
              }
            }>
              <Typography variant="h6" align="left" padding={"10px"} paddingTop="0px">Выберите интервал</Typography>
              <IntervalPicker />
            </Box>
          </Box>
          <Divider />
          <Box id="summary">
            <Typography variant="h6" align="center" padding={"30px"} paddingBottom="0px">Сводная информация</Typography>
            <Summary data={summaryData} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: "20px",
            }}
            id="export"
          >
            <XmlSaveToServer SensorCache={sensorData} Summary={summaryData} />
          </Box>
          <Box id="table">
            <Typography variant="h6" align="center" padding={"30px"} paddingBottom="15px">
              Таблица данных датчиков
            </Typography>
            <Box
              sx={{
                maxHeight: isTableExpanded ? "none" : "500px", // Если таблица раскрыта, ограничение высоты снимается
                overflowY: "auto",
                position: "relative",
                maskImage: isTableExpanded
                  ? "none" // При раскрытии таблицы затемнение убирается
                  : "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
                WebkitMaskImage: isTableExpanded
                  ? "none"
                  : "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
                transition: "mask-image 0.3s ease-in-out", // Плавный переход для затемнения
              }}
            >
              <DataTable cache={sensorData} />
            </Box>
            {/* Кнопка для раскрытия/сворачивания таблицы */}
            <Box textAlign="center" mt={2}>
              <IconButton
                onClick={() => setIsTableExpanded((prev) => !prev)} // Переключение состояния
                aria-label={isTableExpanded ? "Свернуть таблицу" : "Развернуть таблицу"}
              >
                {isTableExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
          </Box>
          <br />
        </center>
      </Box>
    </AppLayout>
  );
};

export default App;