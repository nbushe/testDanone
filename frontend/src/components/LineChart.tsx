import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,

} from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import NoData from './NoData.tsx';
import { SensorData } from '../misc/SensorData.ts';
import { webColors } from '../misc/webColors.ts'
import { maxSensors } from '../misc/maxSensors.ts';
import { Theme, useMediaQuery } from '@mui/material';

interface LineChartProps {
  data: SensorData[];
}

const LineChartComponent: React.FC<LineChartProps> = ({ data }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm")); // Проверка на мобильное устройство
  const [winsize] = useState(!isMobile ?(window.innerWidth * 0.5): 300);




  const plotData = data.length > 0
    ? data.map((item) => {
      const result: Record<string, number> = {};
      item.Sensors.forEach((sensor, index) => {
        result[`Value${index + 1}`] = sensor.Value; // Создаем ключи вида Value1, Value2, ...
      });
      return {
        ...result, // Значения Value1, Value2, ...
        TimeStamp: format(item.TimeStamp, 'dd MMMM yyyy, HH:mm:ss.SSS', { locale: ru })
      }
    })
    : [];

  // Максимальное количество сенсоров в строке данных
  const maxRowsValue = maxSensors(data);

  return (
    <>{data.length > 0
      ? <LineChart
        width={winsize}
        height={400}

        data={plotData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="TimeStamp" />
        <YAxis />
        <Tooltip />
        <Legend  />
        {maxRowsValue.Sensors.map((v, i) =>
          <Line key={v.Name} name={v.Name} type="linear" dataKey={`Value${i + 1}`} stroke={webColors[i]} />
        )}
      </LineChart>
      : <NoData>Нет данных для графика</NoData>}
    </>
  );
};

export default LineChartComponent;