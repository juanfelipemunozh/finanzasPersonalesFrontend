import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/authSlice";

// Parametrizar los features "authSlice". Luego de esto, ir al componenete "Login.jsx"
export const store = configureStore({
  reducer: {
    auth: authReducer
  },
});
