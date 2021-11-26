import { createStore } from 'redux'
import reducer from './reducer'
import { devToolsEnhancer } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'

const storageConfig = {
    key: 'root',
    storage: storageSession, // 缓存机制
}

const myPersistReducer = persistReducer(storageConfig, reducer); //persist包装reducer
const configureStore = createStore(myPersistReducer, devToolsEnhancer());
export const persistor = persistStore(configureStore);
export default configureStore;//返回store
