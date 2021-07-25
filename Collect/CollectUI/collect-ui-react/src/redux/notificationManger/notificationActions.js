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
import { 
    APPHOST, 
    ToastMessageTypes, 
    NotificationAddedSuccesMessage, 
    NotificationDeletedSuccesMessage, 
    NotificationUpdatedSuccesMessage 
} from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'

const notiaxios = new api.NotificationControllerApi({}, APPHOST);
const tagalertAxios = new api.TagAlertControllerApi({}, APPHOST);
const alertAxios = new api.AlertControllerApi({}, APPHOST);
const tgaxios = new api.TagControllerApi({}, APPHOST);

const setNotificationErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setNotificationError(error))
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setNotificationError = (error) => {
    return {
        type: SET_NOTIFICATION_ERROR,
        payload: error
    }
}

const setNotificationSuccessToast = (message) => {
    return function (dispatch) {
        dispatch(setToastData({
            type: ToastMessageTypes.success,
            message: message
        }))
    }
}

export const getNotificationRequest = () => {
    return {
        type: GET_NOTIFICATION_REQUEST
    }
}

export const getNotificationSuccess = (notifications) => {
    return {
        type: GET_NOTIFICATION_REQUEST_SUCCESS,
        payload: notifications
    }
}
export const getSelectedNotificationSuccess = (notifications) => {
    return {
        type: GET_SELECTED_NOTIFICATION_REQUEST_SUCCESS,
        payload: notifications
    }
}

export const getNotificationFailed = (error) => {
    return {
        type: GET_NOTIFICATION_REQUEST_FAILED,
        error: error
    }
}

export const removeNotificationInfo = () => {
    return {
        type: REMOVE_NOTIFICATION_INFO,
        payload: ''
    }
}

export const addNotification = (newNotification) => {
    apiAuthorizer.authorize(notiaxios)
    return function (dispatch) {
        notiaxios.notificationControllerCreate(newNotification)
            .then(response => {
                console.log(response);
                dispatch(getNotification())
                dispatch(setNotificationSuccessToast(NotificationAddedSuccesMessage))
            }).catch(error => {

                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setNotificationErrorRequest(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const deleteNotification = (notificationId) => {
    apiAuthorizer.authorize(notiaxios)
    return function (dispatch) {
        console.log(notificationId)
        notiaxios.notificationControllerDeleteById(notificationId)
            .then(response => {
                console.log("notification deleted")
                dispatch(getNotification())
                dispatch(setNotificationSuccessToast(NotificationDeletedSuccesMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setNotificationErrorRequest(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const updateNotification = (notificationId, updatedNotification) => {
    apiAuthorizer.authorize(notiaxios)
    return function (dispatch) {
        notiaxios.notificationControllerReplaceById(notificationId, updatedNotification)
            .then(response => {
                console.log(response);
                dispatch(getNotification())
                dispatch(setNotificationSuccessToast(NotificationUpdatedSuccesMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setNotificationErrorRequest(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const getNotification = () => {
    apiAuthorizer.authorize(notiaxios)
    return function (dispatch) {
        dispatch(getNotificationRequest())
        var NotificationOrder = {
           order: ['creationTimeStamp DESC']
        }
        notiaxios.notificationControllerFind(JSON.stringify(NotificationOrder)).then(result => {
            const tableDatas = result.data
            console.log(tableDatas)
            dispatch(getNotificationSuccess(tableDatas))
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
                dispatch(setNotificationErrorRequest(error))
                handleError(dispatch, error)
            }
        });
    }
}

export const getNotificationById = (selectedNotificationid, getAlets) => {
    apiAuthorizer.authorize(notiaxios)
    return function (dispatch) {
        notiaxios.notificationControllerFindById(selectedNotificationid)
            .then(response => {
                //console.log(selectedAlertid)
                const notificationData = [response.data]
                if (notificationData === undefined) {
                    dispatch(getNotificationFailed('Invalid data'))
                }
                else {
                    dispatch(getSelectedNotificationSuccess(notificationData))
                    dispatch(selectNotification(notificationData));
                    if(getAlets){
                        dispatch(selectNotificationAlertID(notificationData[0].alertId));
                        dispatch(getNotificationAlertByAlertId(notificationData[0].alertId));
                    }
                }
            }).catch(error => {
                // error.message is the error description
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(getNotificationFailed(error))
                    dispatch(setNotificationErrorRequest(error))
                    handleError(dispatch, error)
                }                
            });
    }
}

export const selectNotification = (notificationID) => {
    return {
        type: SELECT_NOTIFICATION,
        payload: notificationID
    }
}

export const isEditNotification = (status) => {
    return {
        type: ISEDIT_NOTIFICATION,
        payload: status
    }
}

export const filterNotification = (list) => {
    return {
        type: FILTER_NOTIFICATION,
        payload: list
    }
}

export const getNotificationAlertsRequest = () => {
    return {
        type: GET_NOTIFICATION_ALERTS_REQUEST
    }
}

export const getNotificationAlertsSuccess = (alerts) => {
    return {
        type: GET_NOTIFICATION_ALERTS_REQUEST_SUCCESS,
        payload: alerts
    }
}

export const getNotificationSelectAlertsSuccess = (alerts) => {

    return {
        type: GET_NOTIFICATION_SELECTED_ALERTS_REQUEST_SUCCESS,
        payload: alerts
    }
}

export const getNotificationAlertsFailed = (error) => {
    return {
        type: GET_NOTIFICATION_ALERTS_REQUEST_FAILED,
        error: error
    }
}

export const getNotificationAlerts = (selectedTagid) => {
    apiAuthorizer.authorize(tagalertAxios)
    return function (dispatch) {
        dispatch(getNotificationAlertsRequest())
        tagalertAxios.tagAlertControllerFind(selectedTagid)
            .then(response => {
                console.log(response)
                const alertsData = response.data
                if (alertsData == undefined) {
                    dispatch(getNotificationAlertsFailed('Invalid data'))
                }
                else {
                    console.log(alertsData)
                    dispatch(getNotificationAlertsSuccess(alertsData))
                }
            }).catch(error => {
                // error.message is the error description
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setNotificationErrorRequest(error))
                    dispatch(getNotificationAlertsFailed(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getNotificationAlertByAlertId = (selectedAlertid) => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        dispatch(getNotificationAlertsRequest())
        alertAxios.alertControllerFindById(selectedAlertid)
            .then(response => { 
                const alertsData = [response.data]
                if (alertsData == undefined) {
                    dispatch(getNotificationAlertsFailed('Invalid data'))
                }
                else {
                    console.log(alertsData);
                    dispatch(getNotificationSelectAlertsSuccess(alertsData))
                }
            }).catch(error => {
                // error.message is the error description
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(getNotificationAlertsFailed(error))
                    dispatch(setNotificationErrorRequest(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getAllAlerts = () => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        dispatch(getNotificationAlertsRequest())
        dispatch(selectNotificationAlert())
        var AlertOrder = {
            order: ['creationTimeStamp DESC']
         }
        alertAxios.alertControllerFind(JSON.stringify(AlertOrder)).then(result => {
            const alertData = result.data
            console.log('alertData')
            console.log(alertData)
            dispatch(getNotificationAlertsSuccess(alertData))
        }).catch(error => {
            // error.message is the error description
            console.log(error.message)
            dispatch(getNotificationAlertsFailed(error.message))
            handleError(dispatch, error.response)
        });
    }
}

export const selectNotificationAlert = (alert) => {
    console.log(alert)
    return {
        type: SELECT_NOTIFICATION_ALERT,
        payload: alert
    }
}

export const selectNotificationAlertID = (Alertid) => {
    return {
        type: SELECT_NOTIFICATION_ALERTID,
        payload: Alertid
    }
}

export const selectNotificationAlertName = (alertname) => {
    return {
        type: SELECT_NOTIFICATION_ALERTNAME,
        payload: alertname
    }
}

export const getNotificationTagRequest = () => {
    return {
        type: GET_NOTIFICATION_TAGS_REQUEST
    }
}

export const getNotificationTagSuccess = (tags) => {
    return {
        type: GET_NOTIFICATION_TAGS_REQUEST_SUCCESS,
        payload: tags
    }
}

export const getNotificationTagFailed = (error) => {
    return {
        type: GET_NOTIFICATION_TAGS_REQUEST_FAILED,
        error: error
    }
}

export const getNotificationTag = (selectedgroupsid) => {
    return function (dispatch) {
        dispatch(getNotificationTagRequest())
        var tgaxios = new api.TagControllerApi({}, APPHOST);
        var parentIdFilter = { where: { tagGroupId: selectedgroupsid } };
        apiAuthorizer.authorize(tgaxios)
        tgaxios.tagControllerFind(JSON.stringify(parentIdFilter))
            .then(result => {
            const tableDatas = result.data
            console.log(tableDatas)
            dispatch(getNotificationTagSuccess(tableDatas))
            })
            .catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(getNotificationTagFailed(error))
                    dispatch(setNotificationErrorRequest(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getNotificationTagByTagId = (selectedTagid) => {
    apiAuthorizer.authorize(tgaxios)
    return function (dispatch) {
        dispatch(getNotificationTagRequest())
        tgaxios.tagControllerFindById(selectedTagid).then(response => {
            const tagData = [response.data]
            if (tagData == undefined) {
                dispatch(getNotificationAlertsFailed('Invalid data'))
            }
            else {
                const tagName = tagData[0].name
                //dispatch(getNotificationTagSuccess(tagData))
                dispatch(selectNotificationTagname(tagName))
            }
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
                dispatch(getNotificationTagFailed(error))
                dispatch(setNotificationErrorRequest(error))
                handleError(dispatch, error)
            }
        });
    }
}

export const selectNotificationTag = (tagID) => {
    console.log(tagID)
    return {
        type: SELECT_NOTIFICATION_TAG,
        payload: tagID
    }
}

export const selectNotificationTagname = (tagName) => {
    console.log(tagName)
    return {
        type: SELECT_NOTIFICATION_TAGNAME,
        payload: tagName
    }
}

export const removeTagFromBucket = () => {
    return {
        type: REMOVE_NOTIFICATION_TAG_INFO,
        payload: ''
    }
}
export const removeNotificationAlert = () => {
    return {
        type: REMOVE_SELECTED_ALERT,
        payload: ''
    }
}