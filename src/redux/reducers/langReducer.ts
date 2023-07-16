
import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: 'EN',
  reducers: {
    setLanguage: (state, action) => {
        console.log("chekcing action.payload", action.payload)

      return action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
