//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { createStore,applyMiddleware } from 'redux'
import rootReducer from './rootReducer'
import thunkMiddleware from 'redux-thunk'
import { getAlertInfo } from './alertInfo/alertInfoActions'

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

store.subscribe(() => { })
export default store
