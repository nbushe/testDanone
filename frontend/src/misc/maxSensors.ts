import { SensorData } from "./SensorData";

// Возвращает строку данных SensorData с максимальным количеством датчиков
export function maxSensors(data: SensorData[]): SensorData {
    const result: SensorData = (data.length > 0)
        ? data.reduce((maxSensorsRow: SensorData, row: SensorData): SensorData => {
            return row.Sensors.length > maxSensorsRow.Sensors.length ? row : maxSensorsRow;
        },
            { Sensors: [], TimeStamp: new Date().toISOString() }
        )
        : { Sensors: [], TimeStamp: new Date().toISOString() };
    return result;
}