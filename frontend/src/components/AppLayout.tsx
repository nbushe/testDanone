import React from 'react';
import { Container, Box } from '@mui/material';

interface AppLayoutProps {
  children: React.ReactNode; // Тип для дочерних элементов
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container
        maxWidth="lg" // Ограничивает ширину до 80% (или lg = 1200px)
        sx={{
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default AppLayout;