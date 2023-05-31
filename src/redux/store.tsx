import {  configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";
import { useDispatch } from 'react-redux'
import thunkMiddleware from "redux-thunk";

import rootReducer from "./reducers";

// const persistConfig = {
//   key: "root",
//   storage: AsyncStorage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
    // middleware: [...getDefaultMiddleware({ thunk })],
    // middleware: applyMiddleware(thunkMiddleware),
     middleware: [thunkMiddleware, ...getDefaultMiddleware()],
    // middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(thunk),
  // devTools: process.env.NODE_ENV !== "production",
});


export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch 

// export const persistor = persistStore(store);
