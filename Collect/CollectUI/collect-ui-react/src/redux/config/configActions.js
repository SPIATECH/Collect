//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_CONFIG_REQUEST, 
    GET_CONFIG_REQUEST_SUCCESS, 
    GET_CONFIG_REQUEST_FAILED, 
    POST_CONFIG_REQUEST, 
    POST_CONFIG_REQUEST_SUCCESS, 
    POST_CONFIG_REQUEST_FAILED 
} from './configActionTypes'
import {
    APPHOST, 
    ToastMessageTypes, 
    SMSUpdateSuccessToastMessage, 
    SMSUpdateFailedToastMessage, 
    SMTPTUpdateSuccessToastMessage, 
    SMSConfigID, 
    SMTPConfigID ,
    DefaultSMSConfigJSON, 
    DefaultSMTPConfigJSON
} from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'

const configAxios = new api.ConfigControllerApi({}, APPHOST)

const setConfigErrorRequest = (id,error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error,
        }))
    }
}

const setSuccessToast = (id) => {
    return function (dispatch) {
        if (id === "sms") {
            dispatch(setToastData({
                type: ToastMessageTypes.success,
                message: SMSUpdateSuccessToastMessage
            }))
        }
        else if (id === "smtp") {
            dispatch(setToastData({
                type: ToastMessageTypes.success,
                message: SMTPTUpdateSuccessToastMessage
            }))
        }
    }
}

export const getCofigRequest = () => {
    return {
        type: GET_CONFIG_REQUEST
    }
}

export const getConfigRequestSuccess = (config) => {
    return {
        type: GET_CONFIG_REQUEST_SUCCESS,
        payload: config
    }
}

export const getConfigRequestFailed = (id, error) => {
    return {
        type: GET_CONFIG_REQUEST_FAILED,
        error: error,
        configId: id
    }
}

export const getConfig = () => {
    apiAuthorizer.authorize(configAxios)
    return function (dispatch) {
        dispatch(getCofigRequest())
        dispatch(getConfigById(SMSConfigID))
        dispatch(getConfigById(SMTPConfigID))
        //dispatch(getConfigRequestSuccess())
    }
}

const getConfigById = (configId) => {
    return function (dispatch) {
        console.log("Getting " + configId + " config...")
        configAxios.configControllerFindById(configId)
            .then(response => {
                const config = response.data
                console.log("Getting ",configId," config Success...")
                dispatch(getConfigRequestSuccess(config))
            })
            .catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    if(error.statusCode === 404){
                        console.log(configId," config does not exist, setting default ",configId," config...")
                        dispatch(postConfig(configId,true))
                    }
                    else{
                        dispatch(setConfigErrorRequest(configId, error))
                    }
                }
                handleError(dispatch, error)
            })
    }
}

const postCofigRequest = () => {
    return {
        type: POST_CONFIG_REQUEST
    }
}

const postConfigRequestSuccess = (config) => {
    return {
        type: POST_CONFIG_REQUEST_SUCCESS,
        payload: config
    }
}

const postConfigRequestFailed = (error) => {
    return {
        type: GET_CONFIG_REQUEST_FAILED,
        error: error
    }
}

export const postConfig = (config,isDefault) => {
    apiAuthorizer.authorize(configAxios)
    return function (dispatch) {
        if(isDefault){
            console.log("Setting Default ",config," config")
            configAxios.configControllerCreate(config === SMSConfigID ? DefaultSMSConfigJSON : DefaultSMTPConfigJSON)
            .then( response => {
                console.log("Default ",config," config set..")
                dispatch(getConfigById(config))
            }).catch( error => {
                console.log("Setting default ",config," config failed")
            })
        }
        else{
            console.log("Setting ",config.id," config")
            configAxios.configControllerCreate(config)
                .then(response => {
                    console.log(config.id," config set...")
                    dispatch(getConfigById(config.id))
                    dispatch(setSuccessToast(config.id))
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status == '409') {
                        console.log("Configuration for ", config.id, " already exist, updating...")
                        dispatch(updateConfig(config))
                    }
                    else {
                        const tempError = error.response;
                        if (tempError) {
                            error = tempError.data.error;
                            console.log(error)
                            dispatch(setConfigErrorRequest(config.id,error))
                        }
                    }
                })
        }
    }
}

export function importConfig(config) {
    return async function (dispatch, state) {
        dispatch({
            type: POST_CONFIG_REQUEST,
        });
        apiAuthorizer.authorize(configAxios)
        try{
            const response = await configAxios.configControllerCreate(config);
            dispatch(getConfigById(config.id))
            return dispatch({
                type: POST_CONFIG_REQUEST_SUCCESS,
                payload: response.data,
                response
            });

        }catch (error) {
            if(error.response.status == '409'){
                console.log('Config already exist. Updating existing config.');
                console.log(error.response);
                try{
                    const response = await configAxios.configControllerUpdateById(config.id, config);
                    dispatch(getConfigById(config.id))
                    return dispatch({
                        type: POST_CONFIG_REQUEST_SUCCESS,
                        payload: response.data,
                        response
                    });
        
                }catch (error) {
                    return dispatch({
                        type: POST_CONFIG_REQUEST_FAILED,
                        error: error,
                        response: error.response,
                        error,
                    });
                }
            }else{
                return dispatch({
                    type: POST_CONFIG_REQUEST_FAILED,
                    error: error,
                    response: error.response,
                    error,
                });
            }
        }
    }
}

export const updateConfig = (config) => {
    apiAuthorizer.authorize(configAxios)
    return function (dispatch) {
        console.log("Updating ", config.id, " configuration")
        configAxios.configControllerUpdateById(config.id, config)
            .then(response => {
                console.log(config.id, " configuration updated...")
                dispatch(getConfigById(config.id))
                dispatch(setSuccessToast(config.id))
            })
            .catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setConfigErrorRequest(config.id, error))
                }
                handleError(dispatch, error)
            })
    }
}

export const deleteConfig = (id) => {
    apiAuthorizer.authorize(configAxios)
    return function (dispatch) {
        configAxios.configControllerDeleteById(id)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setConfigErrorRequest(id, error))
                }
                handleError(dispatch, error)
            })
    }
}