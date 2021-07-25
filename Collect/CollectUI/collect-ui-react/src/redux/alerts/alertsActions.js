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
import { 
    APPHOST, 
    ToastMessageTypes, 
    AddAlertSuccessMessage,
    UpdateAlertSuccessMessage, 
    DeleteAlertSuccessMessage, 
    CommitToastLabel 
} from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'
 
const tagalertAxios = new api.TagAlertControllerApi({}, APPHOST);
const alertAxios = new api.AlertControllerApi({}, APPHOST);
const commitAxios = new api.CommitControllerApi({}, APPHOST);


export const removeAlertInfo = () =>{
    return {
        type: REMOVE_SELECTED_TAG_ALERT,
        payload: ''
    }
}

export const getAlertsRequest = () => {
    return {
        type: GET_ALERTS_REQUEST
    }
}

export const getAlertsSuccess = (alerts) => {
    return {
        type: GET_ALERTS_REQUEST_SUCCESS,
        payload: alerts
    }
}

const setAlertsErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setAlertsError(error))
    }
}

const setAlertsError = (error) => {
    return {
        type: SET_ALERTS_ERROR,
        error: error
    }
}

const setAlertsErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}


const setAlertsSuccessToast = (message) => {
    return function (dispatch) {
        dispatch(setToastData({
            type: ToastMessageTypes.success,
            message: message
        }))
    }
}

export const getAllAlertsCount = () => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        alertAxios.alertControllerCount()
        .then( response => {
            const count = response.data.count ? response.data.count : 0
            dispatch(getAllAlertsCountSuccess(count))
        }).catch( error => {
            console.log(error)
        })
    }
}

const getAllAlertsCountSuccess = (count) => {
    return {
        type: GET_ALL_AERTS_COUNT_SUCCESS,
        payload: count
    }
}

export const addTagAlert = (newAlert) => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        alertAxios.alertControllerCreate(newAlert)
            .then(response => {
                console.log(response);
                dispatch(getAllAlertsCount())
                dispatch(setAlertsSuccessToast(AddAlertSuccessMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setAlertsErrorToast(error))
                    dispatch(setAlertsErrorRequest(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const updateAlert = (updatedAlert) => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        console.log(updatedAlert.id);
        alertAxios.alertControllerReplaceById(updatedAlert.id, updatedAlert)
            .then(response => {
                console.log(response);
                dispatch(setAlertsSuccessToast(UpdateAlertSuccessMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setAlertsErrorRequest(error))
                    dispatch(setAlertsErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const deleteAlert = (alertID, tagId) => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        console.log(alertID)
        alertAxios.alertControllerDeleteById(alertID)
            .then(response => {
                console.log("alert deleted")
                dispatch(getAllAlertsCount())
                dispatch(getAlerts(tagId))
                dispatch(setAlertsSuccessToast(DeleteAlertSuccessMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setAlertsErrorRequest(error))
                    dispatch(setAlertsErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}


export const getAlerts = (selectedTagid) => {
    apiAuthorizer.authorize(tagalertAxios)
    return function (dispatch) {
        dispatch(getAlertsRequest())
         var AlertOrder = {
           order: ['creationTimeStamp DESC']
        }
        tagalertAxios.tagAlertControllerFind(selectedTagid, JSON.stringify(AlertOrder))
            .then(response => {
                dispatch(getAllAlertsCount())
                const alertsData = response.data
                if (alertsData == undefined) {
                    dispatch(setAlertsErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getAlertsSuccess(alertsData))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setAlertsErrorRequest(error))
                    dispatch(setAlertsErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getAlertsSuccessbyID = (alerts) => {
    return {
        type: SELECTED_ALERT_BY_ID,
        payload: alerts
    }
}

export const getAlertByAlertId = (selectedAlertid) => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        dispatch(removeSelectedAlert());
        dispatch(getAlertsRequest())
        alertAxios.alertControllerFindById(selectedAlertid)
            .then(response => {
                //console.log(selectedAlertid)
                const alertsData = [response.data]
                if (alertsData == undefined) {
                    dispatch(setAlertsErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getAlertsSuccessbyID(alertsData))
                    dispatch(selectAlert(selectedAlertid))
                    dispatch(selectAlertName(alertsData[0].name))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setAlertsErrorRequest(error))
                    dispatch(setAlertsErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const selectAlert = (alert) => {
    return {
        type: SELECT_ALERT,
        payload: alert
    }
}

export const selectAlertName = (alert) => {
    return {
        type: SELECT_ALERT_NAME,
        payload: alert
    }
}

const setCommitSuccessToast = (message) => {
    return function (dispatch) {
        dispatch(setToastData({
            type: ToastMessageTypes.success,
            message: message
        }))
    }
}

export const commitCollect = () => {
    apiAuthorizer.authorize(commitAxios)
    return function (dispatch) {
        commitAxios.commitControllerCommit()
            .then(response => {
                dispatch(setCommitSuccessToast(CommitToastLabel))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setAlertsErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const commitAlerts = () => {
    apiAuthorizer.authorize(alertAxios)
    return function (dispatch) {
        alertAxios.alertControllerCommit()
            .then(response => {
                dispatch(getAllAlertsCount())
                dispatch(commitCollect())
                dispatch(setCommitSuccessToast(CommitToastLabel))
                console.log(response)
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setAlertsErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const filterAlerts = (list) => {
    return {
        type: FILTER_ALERTS,
        payload: list
    }
}

export const removeSelectedAlert = () => {
    return {
        type: REMOVE_SELECTED_ALERTS,
        payload: ''
    }
}