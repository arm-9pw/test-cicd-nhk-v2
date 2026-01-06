import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { apiSlice } from 'api/apiSlice'
import certificateReducer from 'app/slices/certificateSlice'
import currentProgramReducer from 'app/slices/currentProgramSlice'
import errorReducer from 'app/slices/errorSlice'
import loadingReducer from 'app/slices/loadingSlice'
import tokenReducer from 'app/slices/tokenSlice'

import loginReducer from 'features/auth/authSlice'

// import prReducer from 'features/purchaseRequisition/purchaseRequisitionSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

const rootReducer = combineReducers({
  auth: loginReducer,
  certificate: certificateReducer,
  currentProgram: currentProgramReducer,
  error: errorReducer,
  // prData: prReducer,
  loading: loadingReducer,
  token: tokenReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
