import axios from "axios";
// import process from "process";


// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5234/api";
let API_URL: string;

// Получаем среду в которой выполняется наше vite приложение
const isProductionEnv: boolean =  import.meta.env.MODE === "production";


if (isProductionEnv) {
  API_URL =  "http://api_server:5234/api";
  console.log(`API_URL (production) = ${API_URL}`);
} else {
  API_URL =  "http://localhost:5234/api";
  console.log(`API_URL (development) = ${API_URL}`);
}


export const uploadXmlFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload-xml`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchSensorData = async (startDate: string, endDate: string) => {
  console.log(`StartDate: ${startDate}, EndDate: ${endDate}`);
  const data = axios.get(`${API_URL}/data?start=${startDate}&end=${endDate}`).catch(e => { console.log(e) });
  return data;
};

export const fetchSensorSummary = async (startDate: string, endDate: string) => {
  console.log(`StartDate: ${startDate}, EndDate: ${endDate}`);
  return axios.get(`${API_URL}/sensors/summary?start=${startDate}&end=${endDate}`).catch(e => { console.log(e) });
};

