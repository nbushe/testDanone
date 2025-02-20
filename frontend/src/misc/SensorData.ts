export interface SensorData {
    Sensors: {
      Id: number,
      Name: string,
      Value: number
    }[];
    TimeStamp: Date;
  }