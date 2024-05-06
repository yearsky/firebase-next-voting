import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface wordState {
  isAnswered: boolean;
  chanceAnswer: number;
  section: string;
}

const initialState: wordState = {
  isAnswered: false,
  chanceAnswer: 1,
  section: "",
};

const wordSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    setIsAnswered(state, action: PayloadAction<boolean>) {
      state.isAnswered = action.payload;
    },
    setChanceAnswer(state, action: PayloadAction<number>) {
      state.chanceAnswer = action.payload;
    },
    setSectionProps(state, action: PayloadAction<string>) {
      state.section = action.payload;
    },
    clearAnswer(state) {
      state.isAnswered = false;
    },
    clearChanceAnswer(state) {
      state.chanceAnswer = 1;
    },
  },
});

export const {
  setIsAnswered,
  clearAnswer,
  setChanceAnswer,
  clearChanceAnswer,
  setSectionProps,
} = wordSlice.actions;
export const selectAnswer = (state: RootState) => state.answered.isAnswered;
export const chanceAnswer = (state: RootState) => state.answered.chanceAnswer;
export const currentSectionChange = (state: RootState) =>
  state.answered.section;

export default wordSlice.reducer;
