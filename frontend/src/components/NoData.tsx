import React from 'react';
import { Box, Typography } from '@mui/material';

// Определяем типы для пропсов
interface NoDataProps {
  children?: React.ReactNode; // Делаем children необязательным
}

const NoData: React.FC<NoDataProps> = ({ children = "Данные не получены" }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="300px" // Высота области
      bgcolor="#f5f5f5" // Фоновый цвет
      borderRadius={5} // Закругление углов
      boxShadow={0} // Тень для эффекта карточки
      p={3} // Внутренний отступ
    >
      <Typography variant="h6" color="textSecondary" fontFamily={"Ubuntu, Verdana, sans"} mt={2}>
        {children}
      </Typography>
    </Box>
  );
};

export default NoData;