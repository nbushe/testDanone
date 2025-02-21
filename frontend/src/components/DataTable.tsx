import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import NoData from "./NoData";
import { maxSensors } from "../misc/maxSensors";
import { SensorsCache, cacheHelpers } from "../services/cache";

interface DataTableProps {
  cache: SensorsCache;
}

const DataTable: React.FC<DataTableProps> = ({ cache }) => {

  const data = cacheHelpers.toArray(cache).flat();

  // Максимальное количество сенсоров в строке данных
  // Оно нужно для заголовка таблицы
  const maxRowsValue = maxSensors(data) 

  // Random key generator function
  const generateKey = () => Math.random().toString(36).substring(2, 9);

  return (
    <>{data.length > 0 ?
      <TableContainer
        style={
          {
            border: "1px solid #cccc",
            borderRadius: "5px"
          }
        }
        component={Paper}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell align="center" rowSpan={2}>Timestamp</TableCell>
              <TableCell align="center" colSpan={3}>Value</TableCell>
            </TableRow>
            <TableRow>
              {maxRowsValue.Sensors.map((v) =>
                <TableCell key={generateKey()} colSpan={1} align="center">{v.Name}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={generateKey()}>
                <TableCell>{format(new Date(row.TimeStamp), 'dd MMMM yyyy, HH:mm:ss.SSS', { locale: ru })}</TableCell>
                {row.Sensors.map((v) =>
                  <TableCell key={v.Name} align="center">{v.Value}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      : <NoData>НЕТ ДАННЫХ (ОШИБКА СВЯЗИ С СЕРВЕРОМ)</NoData>
    }
    </>
  );
};

export default DataTable;


