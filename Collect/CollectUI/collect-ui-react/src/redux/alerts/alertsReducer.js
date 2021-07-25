//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_ALERTS_REQUEST, 
    GET_ALERTS_REQUEST_SUCCESS,
    SELECTED_ALERT_BY_ID,
    SELECT_ALERT,
    SELECT_ALERT_NAME,
    SET_ALERTS_ERROR, 
    FILTER_ALERTS,
    GET_ALL_AERTS_COUNT_SUCCESS,
    REMOVE_SELECTED_TAG_ALERT,
    REMOVE_SELECTED_ALERTS
} from './alertsActionTypes'

const initialState = {
    loading: false,
    error: null,
    totalAlertsCount: 0,
    CollectTagAlerts: [],
    selectedAlertBucket: [],
    FilterAlertBucket: [],
    selectedAlert: '',
    selectedAlertName: ''
}

const alertsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALERTS_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_ALERTS_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            CollectTagAlerts: action.payload,
            error: null
        }

        case SELECTED_ALERT_BY_ID: return {
            ...state,
            loading: false,
            selectedAlertBucket: action.payload,
            error: null
        }

        case REMOVE_SELECTED_ALERTS: return {
            ...state,
            selectedAlertBucket: []
        }

        case SET_ALERTS_ERROR: return {
            ...state,
            loading: false,
            error: action.error
        }

        case SELECT_ALERT: return {
            ...state,
            selectedAlert: action.payload
        }

        case SELECT_ALERT_NAME: return {
            ...state,
            selectedAlertName: action.payload
        }

        case FILTER_ALERTS: return {
            ...state,
            FilterAlertBucket: action.payload,
        }

        case GET_ALL_AERTS_COUNT_SUCCESS : return{
            ...state,
            totalAlertsCount: action.payload
        }

        case REMOVE_SELECTED_TAG_ALERT : return{
            ...state,
            loading: false,
            CollectTagAlerts: [],
            error: null
        }

        default: return state
    }
}

export default alertsReducer