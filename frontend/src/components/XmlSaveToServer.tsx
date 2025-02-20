// Summary = [
//     {
//         "SensorId": 1,
//         "SensorName": "Sensor1",
//         "Min": 3,
//         "Max": 45,
//         "Avg": 23.5
//     },
//     {
//         "SensorId": 2,
//         "SensorName": "Sensor2",
//         "Min": 56,
//         "Max": 100,
//         "Avg": 76.16666666666667
//     },
//     {
//         "SensorId": 3,
//         "SensorName": "Sensor3",
//         "Min": 14,
//         "Max": 92,
//         "Avg": 62.666666666666664
//     }
// ]

//     SensorData = [
//         {
//             "TimeStamp": "2025-02-18T10:07:42.314038Z",
//             "Sensors": [
//                 {
//                     "Id": 1,
//                     "Name": "Sensor1",
//                     "Value": 14
//                 },
//                 {
//                     "Id": 2,
//                     "Name": "Sensor2",
//                     "Value": 100
//                 },
//                 {
//                     "Id": 3,
//                     "Name": "Sensor3",
//                     "Value": 14
//                 }
//             ]
//         },
//         {
//             "TimeStamp": "2025-02-18T10:07:42.397389Z",
//             "Sensors": [
//                 {
//                     "Id": 1,
//                     "Name": "Sensor1",
//                     "Value": 10
//                 },
//                 {
//                     "Id": 2,
//                     "Name": "Sensor2",
//                     "Value": 56
//                 },
//                 {
//                     "Id": 3,
//                     "Name": "Sensor3",
//                     "Value": 48
//                 }
//             ]
//         },
//         {
//             "TimeStamp": "2025-02-18T10:07:42.397391Z",
//             "Sensors": [
//                 {
//                     "Id": 1,
//                     "Name": "Sensor1",
//                     "Value": 35
//                 },
//                 {
//                     "Id": 2,
//                     "Name": "Sensor2",
//                     "Value": 78
//                 },
//                 {
//                     "Id": 3,
//                     "Name": "Sensor3",
//                     "Value": 75
//                 }
//             ]
//         },
//         {
//             "TimeStamp": "2025-02-18T10:07:42.397392Z",
//             "Sensors": [
//                 {
//                     "Id": 1,
//                     "Name": "Sensor1",
//                     "Value": 45
//                 },
//                 {
//                     "Id": 2,
//                     "Name": "Sensor2",
//                     "Value": 87
//                 },
//                 {
//                     "Id": 3,
//                     "Name": "Sensor3",
//                     "Value": 92
//                 }
//             ]
//         },
//         {
//             "TimeStamp": "2025-02-18T10:07:42.397393Z",
//             "Sensors": [
//                 {
//                     "Id": 1,
//                     "Name": "Sensor1",
//                     "Value": 3
//                 },
//                 {
//                     "Id": 2,
//                     "Name": "Sensor2",
//                     "Value": 59
//                 },
//                 {
//                     "Id": 3,
//                     "Name": "Sensor3",
//                     "Value": 64
//                 }
//             ]
//         },
//         {
//             "TimeStamp": "2025-02-18T10:07:42.397394Z",
//             "Sensors": [
//                 {
//                     "Id": 1,
//                     "Name": "Sensor1",
//                     "Value": 34
//                 },
//                 {
//                     "Id": 2,
//                     "Name": "Sensor2",
//                     "Value": 77
//                 },
//                 {
//                     "Id": 3,
//                     "Name": "Sensor3",
//                     "Value": 83
//                 }
//             ]
//         }
//     ]


import React from "react";
import { Button } from "@mui/material";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { create } from "xmlbuilder2";

interface SensorData {
  TimeStamp: string;
  Sensors: Array<{ Id: number; Name: string; Value: number }>;
}

interface SummaryItem {
  SensorId: number;
  SensorName: string;
  Min: number;
  Max: number;
  Avg: number;
}

interface XmlProps {
  SensorData: SensorData[];
  Summary: SummaryItem[];
}

const options: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
}

export const XmlSaveToServer: React.FC<XmlProps> = ({ SensorData, Summary }) => {

  // // Функция для преобразования JSON в XML
  // const jsonToXml = (json: any): string => {
  //   const xml = new XMLSerializer().serializeToString(
  //     new DOMParser().parseFromString(JSON.stringify(json), "application/xml")
  //   );
  //   return xml.replace(/<\?xml.*\?>/g, ""); // Удаляем заголовок <?xml ... ?>
  // };

  // Функция для преобразования JSON в XML
  const jsonToXml = (json: any): string => {
    // Оборачиваем данные в корневой элемент "SensorData"
    const wrappedData: any = {
      SensorData: json,
    };

    // Создаем XML-документ
    const xml = create(wrappedData, { encoding: "UTF-8" })
      .end({ prettyPrint: true }); // Форматируем с отступами

    return xml;
  };

  // Функция для отправки данных на сервер
  const handleSaveToServer = async () => {
    try {
      // Объединяем SensorData и Summary в один объект
      const dataToConvert = { SensorData, Summary };

      // Преобразуем JSON в XML
      const xmlData = jsonToXml(dataToConvert);
      console.warn("DATA TO CONVERT");
      console.warn(dataToConvert);

      console.warn("XML DATA:");
      console.warn(xmlData);


      // Создаем файл Blob
      const file = new Blob([xmlData], { type: "application/xml" });

      // Отправляем файл на сервер
      const formData = new FormData();
      formData.append("file", file, "data.xml");

      const response = await fetch("http://localhost:5234/api/upload-xml", {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      // Если успешно, показываем уведомление
      toast.success("Данные успешно сохранены!", options);

    } catch (error) {
      // В случае ошибки, показываем сообщение об ошибке
      toast.error(`Произошла ошибка при сохранении данных (${error})`, options);
      console.error(error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveToServer}
      >
        Сохранить снимок данных в базу данных на сервере
      </Button>
    </div>
  );
};