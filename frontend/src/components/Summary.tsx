import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import NoData from './NoData';

// Определяем тип данных
interface SensorSummary {
    SensorId: number;
    SensorName: string;
    Min: number;
    Max: number;
    Avg: number;
}

// Компонент для отображения сводки данных
const Summary: React.FC<{ data: SensorSummary[] }> = ({ data }) => {
    return <>
        {
            data?.length && data.length > 0
                ? <Box mt={4}>
                    <TableContainer
                        style={{
                            border: "1px solid #cccc",
                            borderRadius: "5px"
                        }}
                        component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Датчик</TableCell>
                                    <TableCell align="right">Минимум</TableCell>
                                    <TableCell align="right">Максимум</TableCell>
                                    <TableCell align="right">Среднее</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((sensor) => (
                                    <TableRow key={sensor.SensorId}>
                                        <TableCell>{sensor.SensorName}</TableCell>
                                        <TableCell align="right">{sensor.Min.toFixed(2)}</TableCell>
                                        <TableCell align="right">{sensor.Max.toFixed(2)}</TableCell>
                                        <TableCell align="right">{sensor.Avg.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                : <NoData>Сводка данных недоступна</NoData>

        }
    </>
};

export default Summary;