import React, { useState, useRef } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
  Theme,
  styled,
  Typography,
} from "@mui/material";
import { Home, BarChart, TableChart, CloudDownload, Summarize, KeyboardArrowRight } from "@mui/icons-material";

// Анимированный контейнер для Sidebar
const AnimatedBox = styled(Box)(() => ({
  position: "fixed",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  zIndex: 1000,
  transition: "transform 0.3s ease-in-out",
}));

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Состояние видимости
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Реф для таймера
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm")); // Проверка на мобильное устройство

  // Функция для прокрутки к разделу
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Обработчик наведения мыши (для десктопа)
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Очистка предыдущего таймера
      }
      setIsOpen(true); // Показать панель
    }
  };

  // Обработчик ухода мыши (для десктопа)
  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false); // Скрыть панель через 5 секунд
      }, 600);
    }
  };

  return (
    <>
      {/* Вкладка для свёрнутой панели (видна только на десктопе) */}
      {!isMobile && !isOpen && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "0", // Расположение слева
            transform: "translateY(-50%)", // Центрирование по вертикали
            zIndex: 1000,
            cursor: "pointer",
            backgroundColor: "#fff",
            padding: "8px 16px", // Внутренние отступы
            borderRadius: "0 8px 8px 0", // Закругление правых углов
            boxShadow: "4px 0 6px rgba(0, 0, 0, 0.1)", // Тень справа
            display: "flex",
            alignItems: "center",
            gap: "8px", // Расстояние между иконкой и текстом
          }}
          onMouseEnter={handleMouseEnter}
        >
          <KeyboardArrowRight /> {/* Иконка стрелки вправо */}
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Меню
          </Typography>
        </Box>
      )}

      {/* Основная панель */}
      <AnimatedBox
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          ...(isMobile
            ? {
                bottom: 0, // На мобильных устройствах панель внизу
                left: 0,
                right: 0,
                width: "100%", // Полная ширина
                borderTop: "1px solid #ddd", // Граница сверху
                transform: "none", // Никаких анимаций
                display: "flex",
                justifyContent: "space-around", // Горизонтальное расположение элементов
                padding: "8px 0", // Уменьшенные отступы
              }
            : {
                top: 0,
                left: 0,
                bottom: 0,
                width: "250px", // Ширина панели
                transform: isOpen ? "translateX(0)" : "translateX(-100%)", // Скрываем влево
                flexDirection: "column", // Вертикальное расположение элементов
                padding: "16px",
                backgroundColor: "#f5f5f5",
              }),
        }}
      >
        {/* Список пунктов меню */}
        <List
          sx={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column", // Горизонтально на мобильных, вертикально на десктопе
            gap: isMobile ? 2 : 1, // Расстояние между элементами
          }}
        >
          <Tooltip title="Главная" placement={isMobile ? "top" : "right"}>
            <ListItemButton
              onClick={() => {
                scrollToSection("home");
              }}
              sx={{
                minWidth: "auto", // Убираем минимальную ширину кнопки
                padding: isMobile ? "8px" : "16px", // Разные отступы для мобильной и десктопной версий
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <Home /> 
              </ListItemIcon>
              <Typography  variant="button" paddingLeft={"8px"}>Главная</Typography> 
            </ListItemButton>
          </Tooltip>

          <Tooltip title="График" placement={isMobile ? "top" : "right"}>
            <ListItemButton
              onClick={() => {
                scrollToSection("chart");
              }}
              sx={{
                minWidth: "auto",
                padding: isMobile ? "8px" : "16px",
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <BarChart />
              </ListItemIcon>
              <Typography  variant="button" paddingLeft={"8px"}>График</Typography> 
            </ListItemButton>
          </Tooltip>

          <Tooltip title="Таблица" placement={isMobile ? "top" : "right"}>
            <ListItemButton
              onClick={() => {
                scrollToSection("table");
              }}
              sx={{
                minWidth: "auto",
                padding: isMobile ? "8px" : "16px",
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <TableChart />
              </ListItemIcon>
              <Typography  variant="button" paddingLeft={"8px"}>Таблица</Typography> 
            </ListItemButton>
          </Tooltip>

          <Tooltip title="Сводка" placement={isMobile ? "top" : "right"}>
            <ListItemButton
              onClick={() => {
                scrollToSection("summary");
              }}
              sx={{
                minWidth: "auto",
                padding: isMobile ? "8px" : "16px",
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <Summarize />
              </ListItemIcon>
              <Typography  variant="button" paddingLeft={"8px"}>Сводка</Typography> 
            </ListItemButton>
          </Tooltip>

          <Tooltip title="Экспорт" placement={isMobile ? "top" : "right"}>
            <ListItemButton
              onClick={() => {
                scrollToSection("export");
              }}
              sx={{
                minWidth: "auto",
                padding: isMobile ? "8px" : "16px",
              }}
            >
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <CloudDownload />
              </ListItemIcon>
              <Typography  variant="button" paddingLeft={"8px"}>Экспорт</Typography> 
            </ListItemButton>
          </Tooltip>
        </List>
      </AnimatedBox>
    </>
  );
};

export default Sidebar;