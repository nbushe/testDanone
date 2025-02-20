// src/components/IntervalPicker.tsx
import React, { useEffect } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setStartDate, setEndDate } from '../redux/intervalSlice';
import { RootState } from '../redux/store';
import dayjs, { Dayjs } from 'dayjs';

interface IntervalPickerProps {
  defaultStartDate?: string; // Дата начала по умолчанию (ISO строка)
  defaultEndDate?: string;   // Дата окончания по умолчанию (ISO строка)
}

const IntervalPicker: React.FC<IntervalPickerProps> = ({ defaultStartDate, defaultEndDate }) => {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state: RootState) => state.interval);

  // Используем значения по умолчанию из пропсов или Redux
  const resolvedStartDate = startDate ? dayjs(startDate) : dayjs(defaultStartDate ?? new Date(Date.now() - 30 * 60).toISOString());
  const resolvedEndDate = endDate ? dayjs(endDate) : dayjs(defaultEndDate ?? Date());

  // Обновляем Redux при изменении дат
  const handleStartDateChange = (newDate: Dayjs | null) => {
    dispatch(setStartDate(newDate?.toISOString() ?? null));
  };

  const handleEndDateChange = (newDate: Dayjs | null) => {
    dispatch(setEndDate(newDate?.toISOString() ?? null));
  };

  useEffect(() => {

    dispatch(setStartDate(new Date(Date.now() - 30 * 60).toISOString()));


    dispatch(setEndDate(new Date(Date.now()).toISOString()));

  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', justifyContent: "center" }}>
        <DateTimePicker
          label="Начало"
          value={resolvedStartDate}
          onChange={handleStartDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
        <DateTimePicker
          label="Конец"
          value={resolvedEndDate}
          onChange={handleEndDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />

      </div>
    </LocalizationProvider>
  );
};

export default IntervalPicker;