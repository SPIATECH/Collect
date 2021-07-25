//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_DASH_DEVICE_REQUEST, 
    GET_DASH_DEVICE_REQUEST_SUCCESS, 
    GET_DASH_DEVICE_REQUEST_FAILED, 
    GET_DASH_GROUP_REQUEST, 
    GET_DASH_GROUP_REQUEST_SUCCESS, 
    GET_DASH_GROUP_REQUEST_FAILED, 
    GET_DASH_TAG_REQUEST, 
    GET_DASH_TAG_REQUEST_SUCCESS, 
    GET_DASH_TAG_REQUEST_FAILED, 
    GET_DASH_ALERT_REQUEST, 
    GET_DASH_ALERT_REQUEST_SUCCESS, 
    GET_DASH_ALERT_REQUEST_FAILED, 
    GET_DASH_NOTIFICATION_REQUEST, 
    GET_DASH_NOTIFICATION_REQUEST_SUCCESS, 
    GET_DASH_NOTIFICATION_REQUEST_FAILED 
} from './dashboardActionTypes'

const initialState = {
    loading: false,
    error: '',
    dashDeviceCount: 0,
    dashGroupCount: 0,
    dashTagCount: 0,
    dashAlertCount: 0,
    dashNotificationCount: 0
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_DASH_DEVICE_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_DASH_DEVICE_REQUEST_FAILED: return {
            ...state,
            loading: false,
            dashDeviceCount: 0,
        }

        case GET_DASH_DEVICE_REQUEST_SUCCESS: return {
            ...state,
            dashDeviceCount: action.payload,
            error: null
        }

        case GET_DASH_GROUP_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_DASH_GROUP_REQUEST_FAILED: return {
            ...state,
            loading: false,
            dashGroupCount: 0,
        }

        case GET_DASH_GROUP_REQUEST_SUCCESS: return {
            ...state,
            dashGroupCount: action.payload,
            error: null
        }

        case GET_DASH_TAG_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_DASH_TAG_REQUEST_FAILED: return {
            ...state,
            loading: false,
            dashTagCount: 0,
        }

        case GET_DASH_TAG_REQUEST_SUCCESS: return {
            ...state,
            dashTagCount: action.payload,
            error: null
        }

        case GET_DASH_ALERT_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_DASH_ALERT_REQUEST_FAILED: return {
            ...state,
            loading: false,
            dashAlertCount: 0,
        }

        case GET_DASH_ALERT_REQUEST_SUCCESS: return {
            ...state,
            dashAlertCount: action.payload,
            error: null
        }

        case GET_DASH_NOTIFICATION_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_DASH_NOTIFICATION_REQUEST_FAILED: return {
            ...state,
            loading: false,
            dashNotificationCount: 0,
        }

        case GET_DASH_NOTIFICATION_REQUEST_SUCCESS: return {
            ...state,
            dashNotificationCount: action.payload,
            error: null
        }
        
        default: return state
    }
}

export default dashboardReducer