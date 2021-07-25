//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_EXPORT_ALERT_REQUEST, 
    GET_EXPORT_ALERT_REQUEST_SUCCESS, 
    GET_EXPORT_ALERT_REQUEST_FAILED, 
    GET_EXPORT_CONFIG_REQUEST, 
    GET_EXPORT_CONFIG_REQUEST_SUCCESS, 
    GET_EXPORT_CONFIG_REQUEST_FAILED, 
    REMOVE_EXPORT_DATAS 
} from './exportActionTypes'

const initialState = {
    loading: false,
    error: '',
    exportAlertBucket: [],
    exportConfigBucket: []
}

const exportReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EXPORT_ALERT_REQUEST: return {
            ...state,
            loading: true
        }
        case GET_EXPORT_ALERT_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            exportAlertBucket: action.payload,
            error: ''
        }
        case GET_EXPORT_ALERT_REQUEST_FAILED: return {
            ...state,
            loading: false,
            exportAlertBucket: [],
            error: action.error
        }

        case GET_EXPORT_CONFIG_REQUEST: return {
            ...state,
            loading: true
        }
        case GET_EXPORT_CONFIG_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            exportConfigBucket: action.payload,
            error: ''
        }
        case GET_EXPORT_CONFIG_REQUEST_FAILED: return {
            ...state,
            loading: false,
            exportConfigBucket: [],
            error: action.error
        }

        case REMOVE_EXPORT_DATAS: return {
            ...state,
            loading: false,
            exportAlertBucket: [],
            exportNotificationBucket: [],
            exportConfigBucket: [],
            error: ''
        }

        default: return state
    }
}

export default exportReducer