import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import appSettingsReducer from './slices/appSettingsSlice';
import profileReducer from './slices/profileSlice';
import { productsApi } from '../api/productsApi';
import { cartApi } from '../api/cartApi';
import { ordersApi } from '../api/ordersApi';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['auth', 'appSettings'],
	timeout: 10000, // Increase timeout for slower devices
	debug: __DEV__, // Enable debug in development
};

const rootReducer = combineReducers({
	auth: authReducer,
	appSettings: appSettingsReducer,
	profile: profileReducer,
	[productsApi.reducerPath]: productsApi.reducer,
	[cartApi.reducerPath]: cartApi.reducer,
	[ordersApi.reducerPath]: ordersApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
			},
		}).concat(
			productsApi.middleware,
			cartApi.middleware,
			ordersApi.middleware
		),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
