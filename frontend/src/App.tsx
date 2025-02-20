import React, { useEffect, useState } from "react";
import DataTable from "./components/DataTable";
import LineChart from "./components/LineChart";
import { fetchSensorData, fetchSensorSummary } from "./services/api";
import { Box, Divider, Typography } from "@mui/material";
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

const App: React.FC = () => {
  const [sensorData, setSensorData] = React.useState<any[]>([]);
  const [chartData, setChartData] = React.useState<any>({});
  const [summaryData, setSummaryData] = React.useState<any>({});
  const { startDate, endDate } = useSelector((state: RootState) => state.interval);
  const [isTableExpanded, setIsTableExpanded] = useState(false); // Состояние для раскрытия таблицы

  useEffect(() => {
    const fetchData = async () => {
      const axiosResponse = await fetchSensorData(startDate ?? "", endDate ?? "");
      const summaryResponse = (await fetchSensorSummary(startDate ?? "", endDate ?? ""))?.data;
      console.log("DATARESPONSE");
      console.log(axiosResponse?.data);
      setSensorData(axiosResponse?.data || []);
      setChartData(axiosResponse?.data || {});
      setSummaryData(summaryResponse);
    };
    const intervalId = setInterval(fetchData, 5000);
    fetchData();
    return () => clearInterval(intervalId);
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
                border: "1px solid gray",
                borderRadius: "15px",
                backgroundColor: "#fefeef"
              }
            }>
            <Typography variant="h6" lineHeight="1" align="center" padding={"30px"} paddingBottom="30px">График данных датчиков</Typography>
            <LineChart data={chartData} />
            <Typography variant="subtitle1" padding={"40px"} lineHeight="1" align="center"  >
              {`График построен в интервале с ${format(startDate ?? constructNow(""), 'dd MMMM yyyy, HH:mm:ss.SSS', { locale: ru })}`}
              {`   -      по ${format(endDate ?? constructNow(""), 'dd MMMM yyyy, HH:mm:ss.SSS', { locale: ru })}`}
            </Typography>
            <Box id="" sx={
              {
                borderTop: "1px solid gray", // #1976d2
                borderRadius: "15px",
                padding: "20px",
                paddingBottom: "30px",
                backgroundColor: "#fefed5"
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
            <XmlSaveToServer SensorData={sensorData} Summary={summaryData} />
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
              <DataTable data={sensorData} />
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
          {/* <Box id="table" >
            <Typography variant="h6" align="center" padding={"15px"} paddingBottom="15px">Таблица данных датчиков</Typography>
            <DataTable data={sensorData} />
          </Box> */}
          <br />
        </center>
      </Box>
    </AppLayout>
  );
};

export default App;