//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    SET_ALERTS_IMPORT_ERROR, 
    GET_IMPORT_REQUEST, 
    GET_DELETING_ALL_DATAS, 
    GET_DELETING_ALERT_NOTIFICATION_DATAS, 
    SET_IMPORT_SUCCESS,
    SET_IMPORT_FAILED, 
    SET_IMPORT_NOTIFICATION_SUCCESS,
    SET_IMPORT_NOTIFICATION_SUCCESS_FAILED,
    GET_DELETING_ALERT_NOTIFICATION_DATAS_FAILED,
    GET_DELETING_ALL_DATAS_FAILED
} from './importActionTypes'

const initialState = {
    loading: false,
    error: null,
    TempDeletingBucket: [],
    ImportAlertStatus: '',
    ImportNotifiStatus: ''
}

const importReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_IMPORT_REQUEST: return {
            ...state,
            loading: true
        }

        case SET_IMPORT_SUCCESS: return {
            ...state,
            loading: false,
            ImportAlertStatus: action.payload,
            error: ''
        }

        case SET_IMPORT_FAILED: return {
            ...state,
            loading: false,
            error: action.error
        }
        case SET_IMPORT_NOTIFICATION_SUCCESS_FAILED: return {
            ...state,
            loading: false,
            error: action.error
        }
        case GET_DELETING_ALERT_NOTIFICATION_DATAS_FAILED: return {
            ...state,
            loading: false,
            error: action.error
        }
        case GET_DELETING_ALL_DATAS_FAILED: return {
            ...state,
            loading: false,
            error: action.error
        }

        case SET_IMPORT_NOTIFICATION_SUCCESS: return {
            ...state,
            loading: false,
            ImportNotifiStatus: action.payload,
            error: ''
        }

        case GET_DELETING_ALL_DATAS: return {
            ...state,
            loading: false
        }

        case SET_ALERTS_IMPORT_ERROR: return {
            ...state,
            loading: false,
            error: action.error
        }

        case GET_DELETING_ALERT_NOTIFICATION_DATAS: return {
            ...state,
            loading: false,
            TempDeletingBucket: action.payload,
            error: null
        }

        default: return state
    }
}

export default importReducer