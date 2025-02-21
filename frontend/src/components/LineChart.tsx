import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,

} from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import NoData from './NoData.tsx';
import { webColors } from '../misc/webColors.ts'
import { maxSensors } from '../misc/maxSensors.ts';
import { SensorsCache, cacheHelpers } from '../services/cache.ts';

interface LineChartProps {
  cache: SensorsCache;//SensorData[];
}

const LineChartComponent: React.FC<LineChartProps> = ({ cache }) => {
  // const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm")); // Проверка на мобильное устройство

  const data = useMemo(() => cacheHelpers.toArray(cache).flat(), [cache])

  const plotData = useMemo(() => {
    if (data.length === 0) return []

    return data.map(item => ({
      ...item.Sensors.reduce((acc, sensor, idx) => ({
        ...acc,
        [`Value${idx + 1}`]: sensor.Value
      }), {}),
      TimeStamp: format(new Date(item.TimeStamp), 'dd MMM yyyy HH:mm', { locale: ru })
    }))
  }, [data])

  const maxRowsValue = useMemo(() => maxSensors(data), [data])

  return (
    <>{data.length > 0

      ? <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={plotData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="TimeStamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {maxRowsValue.Sensors.map((v, i) =>
            <Line key={v.Name} name={v.Name} type="linear" dataKey={`Value${i + 1}`} stroke={webColors[i]} />
          )}
        </LineChart>
      </ResponsiveContainer>
      : <NoData>Нет данных для графика</NoData>}
    </>
  );
};

export default LineChartComponent;