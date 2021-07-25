//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_NOTIFICATION_REQUEST, 
    FILTER_NOTIFICATION, 
    GET_NOTIFICATION_REQUEST_SUCCESS, 
    GET_SELECTED_NOTIFICATION_REQUEST_SUCCESS, 
    ISEDIT_NOTIFICATION, 
    GET_NOTIFICATION_REQUEST_FAILED, 
    SELECT_NOTIFICATION, 
    REMOVE_NOTIFICATION_INFO, 
    GET_NOTIFICATION_ALERTS_REQUEST, 
    GET_NOTIFICATION_ALERTS_REQUEST_SUCCESS, 
    GET_NOTIFICATION_ALERTS_REQUEST_FAILED, 
    SELECT_NOTIFICATION_ALERT, 
    GET_NOTIFICATION_SELECTED_ALERTS_REQUEST_SUCCESS, 
    SELECT_NOTIFICATION_ALERTID, 
    SELECT_NOTIFICATION_ALERTNAME, 
    GET_NOTIFICATION_TAGS_REQUEST, 
    GET_NOTIFICATION_TAGS_REQUEST_SUCCESS, 
    GET_NOTIFICATION_TAGS_REQUEST_FAILED, 
    SELECT_NOTIFICATION_TAG, 
    SELECT_NOTIFICATION_TAGNAME, 
    REMOVE_NOTIFICATION_TAG_INFO, 
    SET_NOTIFICATION_ERROR,
    REMOVE_SELECTED_ALERT 
 } from './notificationActionTypes'

const initialState = {
    loading: false,
    error: null,
    NotificationBucket: [],
    SelectedNotificationBucket: [],
    FilterNotificationBucket: [],
    selectedNotification: '',
    isEdit: false,
    TagAlertsBucket: [],
    SelectedAlertsBucket: [],
    selectedNotificationAlert: {},
    selectedNotificationAlertid: '',
    selectedNotificationAlertname: "",
    TagBucket: [],
    selectedNotificationTag: '',
    selectedNotificationTagname: '',
}

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_NOTIFICATION_ALERTS_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_NOTIFICATION_ALERTS_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            TagAlertsBucket: action.payload,
            error: null
        }
        case GET_NOTIFICATION_SELECTED_ALERTS_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            SelectedAlertsBucket: action.payload,
            error: null
        }

        case GET_NOTIFICATION_ALERTS_REQUEST_FAILED: return {
            ...state,
            loading: false,
            TagAlertsBucket: [],
        }

        case SELECT_NOTIFICATION_ALERT: return {
            ...state,
            selectedNotificationAlert: action.payload
        }

        case SELECT_NOTIFICATION_ALERTID: return {
            ...state,
            selectedNotificationAlertid: action.payload
        }
        case SELECT_NOTIFICATION_ALERTNAME: return {
            ...state,
            selectedNotificationAlertname: action.payload
        }

        case GET_NOTIFICATION_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_NOTIFICATION_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            NotificationBucket: action.payload,
            error: null
        }

        case GET_SELECTED_NOTIFICATION_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            SelectedNotificationBucket: action.payload,
            error: null
        }

        case GET_NOTIFICATION_REQUEST_FAILED: return {
            ...state,
            loading: false,
            NotificationBucket: []
        }

        case REMOVE_NOTIFICATION_INFO: return {
            ...state,
            SelectedNotificationBucket: []
        }

        case REMOVE_SELECTED_ALERT: return {
            ...state,
            SelectedAlertsBucket: []
        }

        case SELECT_NOTIFICATION: return {
            ...state,
            selectedNotification: action.payload
        }

        case ISEDIT_NOTIFICATION: return {
            ...state,
            isEdit: action.payload
        }

        case FILTER_NOTIFICATION: return {
            ...state,
            FilterNotificationBucket: action.payload,
        }

        case GET_NOTIFICATION_TAGS_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_NOTIFICATION_TAGS_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            TagBucket: action.payload,
            error: null
        }

        case GET_NOTIFICATION_TAGS_REQUEST_FAILED: return {
            ...state,
            loading: false,
            TagBucket: [],
        }

        case SELECT_NOTIFICATION_TAG: return {
            ...state,
            selectedNotificationTag: action.payload,
        }

        case SELECT_NOTIFICATION_TAGNAME: return {
            ...state,
            selectedNotificationTagname: action.payload,
        }

        case REMOVE_NOTIFICATION_TAG_INFO: return {
            ...state,
            loading: false,
            TagBucket: [],
            error: null
        }

        case SET_NOTIFICATION_ERROR: return {
            ...state,
            loading: false,
            error: action.payload
        }

        default: return state
    }
}

export default notificationReducer