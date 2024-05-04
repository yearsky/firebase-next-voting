"use client";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store, { persistor } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
