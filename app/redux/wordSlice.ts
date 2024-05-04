import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface wordState {
  isAnswered: boolean;
}

const initialState: wordState = {
  isAnswered: false,
};

const wordSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    setIsAnswered(state, action: PayloadAction<boolean>) {
      state.isAnswered = action.payload;
    },
    clearAnswer(state) {
      state.isAnswered = false;
    },
  },
});

export const { setIsAnswered, clearAnswer } = wordSlice.actions;
export const selectAnswer = (state: RootState) => state.answered.isAnswered;

export default wordSlice.reducer;
