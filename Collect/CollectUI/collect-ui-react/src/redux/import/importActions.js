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

import { handleError } from '../apiErrorHandler'
import { APPHOST} from '../../common/GlobalConstants'
import * as api from '../../api/index';
import apiAuthorizer from '../../common/apiAuthorizer'

const alertAxios = new api.AlertControllerApi({}, APPHOST);
const notiaxios = new api.NotificationControllerApi({}, APPHOST);

export function importAlerts(newAlert) {
    return async function (dispatch, state) {
        dispatch({
            type: GET_IMPORT_REQUEST,
        });
        
        apiAuthorizer.authorize(alertAxios)
        try {
            const response = await alertAxios.alertControllerCreate(newAlert);
            return dispatch({
                type: SET_IMPORT_SUCCESS,
                payload: response.data,
                response
            });
        }
        catch (error) {
            return dispatch({
                type: SET_IMPORT_FAILED,
                error: error,
                response: error.response,
                error,
            });
        }
    };
}

export function importNotification(newNotification) {
    return async function (dispatch, state) {
        dispatch({
            type: GET_IMPORT_REQUEST,
        });

        var NotificationInclude = {
            include: [{ relation: 'notifications' }]
        }
        apiAuthorizer.authorize(notiaxios)
        try {
            const response = await notiaxios.notificationControllerCreate(newNotification);
            return dispatch({
                type: SET_IMPORT_NOTIFICATION_SUCCESS,
                payload: response.data,
                response,
            });
        }
        catch (error) {
            return dispatch({
                type: SET_IMPORT_NOTIFICATION_SUCCESS_FAILED,
                error: error,
                response: error.response,
                error,
            });
        }
    };
}

export const keepTempAlertNotification = (notifications) => {
    return {
        type: GET_DELETING_ALERT_NOTIFICATION_DATAS,
        payload: notifications
    }
}

export function getAllTempAlertNotification() {
    return async function (dispatch, state) {
        dispatch({
            type: GET_IMPORT_REQUEST,
        });

        var NotificationInclude = {
            include: [{ relation: 'notifications' }]
        }
        apiAuthorizer.authorize(alertAxios)
        try {
            const response = await alertAxios.alertControllerFind(JSON.stringify(NotificationInclude));
            return dispatch({
                type: GET_DELETING_ALERT_NOTIFICATION_DATAS,
                payload: response.data,
                response,
            });
        }
        catch (error) {
            return dispatch({
                type: GET_DELETING_ALERT_NOTIFICATION_DATAS_FAILED,
                error: error,
                response: error.response,
                error,
            });
        }
    };
}


export function deleteAllAlertNotification() {
    return async function (dispatch, state) {
        dispatch({
            type: GET_IMPORT_REQUEST,
        });
        var NotificationInclude = {
            include: [{ relation: 'notifications' }]
        }
        apiAuthorizer.authorize(alertAxios)
        try {
            const response = await alertAxios.alertControllerDeleteAll(JSON.stringify(NotificationInclude));
            dispatch(deleteImpNotification())
            return dispatch({
                type: GET_DELETING_ALL_DATAS,
                response,
            });
        }
        catch (error) {
            return dispatch({
                type: GET_DELETING_ALL_DATAS_FAILED,
                error: error,
                response: error.response,
                error,
            });
        }
    };
}

export const deleteImpNotification = () => {
    apiAuthorizer.authorize(notiaxios)
    return function (dispatch) {
        notiaxios.notificationControllerDeleteAll()
            .then(response => {
                console.log("notification deleted")
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    handleError(dispatch, error)
                }
            })
    }
}