import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface questionState {
  section: string;
  active: boolean;
}

const initialState: questionState = {
  section: "wordClouds",
  active: true,
};

const questionSlice = createSlice({
  name: "questionSection",
  initialState,
  reducers: {
    setSection(state, action: PayloadAction<string>) {
      state.section = action.payload;
    },
    setActiveSection(state, action: PayloadAction<boolean>) {
      state.active = action.payload;
    },
    clearSection(state) {
      state.section = "";
      state.active = false;
    },
  },
});

export const { setSection, setActiveSection, clearSection } =
  questionSlice.actions;

export default questionSlice.reducer;
