import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface UserState {
  username: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  username: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setIsLoggedInHooks(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    clearUser(state) {
      state.username = "";
      state.isLoggedIn = false;
    },
  },
});

export const { setUsername, setIsLoggedInHooks, clearUser } = userSlice.actions;
export const selectUsername = (state: RootState) => state.user.username;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export default userSlice.reducer;
