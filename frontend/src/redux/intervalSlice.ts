// src/redux/intervalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IntervalState {
  startDate: string | null; // Храним дату как строку ISO
  endDate: string | null;   // Храним дату как строку ISO
}

const initialState: IntervalState = {
  startDate: null,
  endDate: null,
};

const intervalSlice = createSlice({
  name: 'interval',
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },
  },
});

export const { setStartDate, setEndDate } = intervalSlice.actions;
export default intervalSlice.reducer;