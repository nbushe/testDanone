export interface SensorData {
  Sensors: Sensors[];
  TimeStamp: string;
}

export interface Sensors {
  Id: number,
  Name: string,
  Value: number
}