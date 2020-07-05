import { AsyncStorage } from 'react-native';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: '@emec',
      storage: AsyncStorage,
      whitelist: ['auth', 'finance'],
    },
    reducers
  );

  return persistedReducer;
};
