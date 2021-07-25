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
import { APPHOST, ToastMessageTypes } from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'

const dashDeviceAxios = new api.DeviceControllerApi({}, APPHOST);
const dashGroupAxios = new api.TagGroupControllerApi({}, APPHOST);
const dashTagAxios = new api.TagControllerApi({}, APPHOST);
const dashAlertAxios = new api.AlertControllerApi({}, APPHOST);
const dashNotiAxios = new api.NotificationControllerApi({}, APPHOST);

// Devices

export const getDashDeviceRequest = () => {
    return {
        type: GET_DASH_DEVICE_REQUEST
    }
}

export const getDashDeviceSuccess = (tags) => {
    return {
        type: GET_DASH_DEVICE_REQUEST_SUCCESS,
        payload: tags
    }
}

const setDashDeviceError = (error) => {
    return function (dispatch) {
        dispatch(setDashDeviceFailed(error))
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setDashDeviceFailed = (error) => {
    return {
        type: GET_DASH_DEVICE_REQUEST_FAILED,
        payload: error
    }
}

export const getDashDeviceCount = () => {
    apiAuthorizer.authorize(dashDeviceAxios)
    return function (dispatch) {
        dispatch(getDashDeviceRequest())
        dashDeviceAxios.deviceControllerCount().then(result => {
            const deviceCount = result.data.count
            dispatch(getDashDeviceSuccess(deviceCount))
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
                dispatch(setDashDeviceError(error))
                handleError(dispatch, error)
            }
        });
    }
}


//Groups

export const getDashGroupRequest = () => {
    return {
        type: GET_DASH_GROUP_REQUEST
    }
}

export const getDashGroupSuccess = (tags) => {
    return {
        type: GET_DASH_GROUP_REQUEST_SUCCESS,
        payload: tags
    }
}

const setDashGroupError = (error) => {
    return function (dispatch) {
        dispatch(setDashGroupFailed(error))
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setDashGroupFailed = (error) => {
    return {
        type: GET_DASH_GROUP_REQUEST_FAILED,
        payload: error
    }
}

export const getDashGroupCount = () => {
    apiAuthorizer.authorize(dashGroupAxios)
    return function (dispatch) {
        dispatch(getDashGroupRequest())
        dashGroupAxios.tagGroupControllerCount().then(result => {
            const groupCount = result.data.count
            dispatch(getDashGroupSuccess(groupCount))
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
                dispatch(setDashGroupError(error))
                handleError(dispatch, error)
            }
        });
    }
}

//Tag 

export const getDashTagRequest = () => {
    return {
        type: GET_DASH_TAG_REQUEST
    }
}

export const getDashTagSuccess = (tags) => {
    return {
        type: GET_DASH_TAG_REQUEST_SUCCESS,
        payload: tags
    }
}

const setDashTagError = (error) => {
    return function (dispatch) {
        dispatch(setDashTagFailed(error))
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setDashTagFailed = (error) => {
    return {
        type: GET_DASH_TAG_REQUEST_FAILED,
        payload: error
    }
}

export const getDashTagCount = () => {
    return function (dispatch) {
        apiAuthorizer.authorize(dashTagAxios)
        dispatch(getDashTagRequest())
        dashTagAxios.tagControllerCount().then(result => {
            const tagCount = result.data.count
            dispatch(getDashTagSuccess(tagCount))
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
                dispatch(setDashTagError(error))
                handleError(dispatch, error)
            }
        });
    }
}

//Alert 

export const getDashAlertRequest = () => {
    return {
        type: GET_DASH_ALERT_REQUEST
    }
}

export const getDashAlertSuccess = (tags) => {
    return {
        type: GET_DASH_ALERT_REQUEST_SUCCESS,
        payload: tags
    }
}

const setDashAlertError = (error) => {
    return function (dispatch) {
        dispatch(setDashAlertFailed(error))
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setDashAlertFailed = (error) => {
    return {
        type: GET_DASH_ALERT_REQUEST_FAILED,
        payload: error
    }
}

export const getDashAlertCount = () => {
    apiAuthorizer.authorize(dashAlertAxios)
    return function (dispatch) {
        dispatch(getDashAlertRequest())
        dashAlertAxios.alertControllerCount().then(result => {
            const alertCount = result.data.count
            dispatch(getDashAlertSuccess(alertCount))
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
                dispatch(setDashAlertError(error))
                handleError(dispatch, error)
            }
        });
    }
}

//Notification 

export const getDashNotificationRequest = () => {
    return {
        type: GET_DASH_NOTIFICATION_REQUEST
    }
}

export const getDashNotificationSuccess = (tags) => {
    return {
        type: GET_DASH_NOTIFICATION_REQUEST_SUCCESS,
        payload: tags
    }
}

const setDashNotificationError = (error) => {
    return function (dispatch) {
        dispatch(setDashNotificationFailed(error))
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setDashNotificationFailed = (error) => {
    return {
        type: GET_DASH_NOTIFICATION_REQUEST_FAILED,
        payload: error
    }
}

export const getDashNotificationCount = () => {
    apiAuthorizer.authorize(dashNotiAxios)
    return function (dispatch) {
        dispatch(getDashAlertRequest())
        dashNotiAxios.notificationControllerCount().then(result => {
            const notiCount = result.data.count
            dispatch(getDashNotificationSuccess(notiCount))
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
                dispatch(setDashNotificationError(error))
                handleError(dispatch, error)
            }
        });
    }
}