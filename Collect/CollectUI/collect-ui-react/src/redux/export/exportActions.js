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
import { APPHOST } from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import apiAuthorizer from '../../common/apiAuthorizer'

const alertAxios = new api.AlertControllerApi({}, APPHOST);
const configAxios = new api.ConfigControllerApi({}, APPHOST);

export function getExportConfig() {
    return async function (dispatch, state) {
        dispatch({
            type: GET_EXPORT_CONFIG_REQUEST,
        });
        apiAuthorizer.authorize(configAxios)
        try {
            const response = await configAxios.configControllerFind();
            return dispatch({
                type: GET_EXPORT_CONFIG_REQUEST_SUCCESS,
                payload: response.data,
                response
            });
        }
        catch (error) {
            return dispatch({
                type: GET_EXPORT_CONFIG_REQUEST_FAILED,
                error: error,
                response: error.response,
                error,
            });
        }
    };
}

export function getExport() {
    return async function (dispatch, state) {
        dispatch({
            type: GET_EXPORT_ALERT_REQUEST,
        });
        var NotificationInclude = {
            include: [{ relation: 'notifications' }]
        }
        apiAuthorizer.authorize(alertAxios)
        try {
            const response = await alertAxios.alertControllerFind(JSON.stringify(NotificationInclude));
            return dispatch({
                type: GET_EXPORT_ALERT_REQUEST_SUCCESS,
                payload: response.data,
                response
            });
        }
        catch (error) {
            return dispatch({
                type: GET_EXPORT_ALERT_REQUEST_FAILED,
                error: error,
                response: error.response,
                error,
            });
        }
    };
}

export const removeExportData = () => {
    return {
        type: REMOVE_EXPORT_DATAS,
        payload: ''
    }
}