//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
    GET_DEVICE_TYPE_REQUEST,
    GET_DEVICE_TYPE_REQUEST_SUCCESS,
    GET_DEVICE_TYPE_REQUEST_FAILED,
    SELECT_DEVICE_TYPE,
    SET_DEVICE_TYPE_ERROR,
    GET_SELECTED_DEVICE_TYPE_SUCCESS,
    SELECT_DEVICE_TYPE_ID
} from './dataSourceActionTypes'

import { 
    APPHOST, 
    ToastMessageTypes 
} from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'


var deviceTypeAxios = new api.DeviceTypeControllerApi({}, APPHOST);

export const getDeviceTypeRequest = () => {
    return {
        type: GET_DEVICE_TYPE_REQUEST
    }
}

export const getDeviceTypeSuccess = (devicetypes) => {
    return {
        type: GET_DEVICE_TYPE_REQUEST_SUCCESS,
        payload: devicetypes
    }
}
export const getSelectedDeviceTypeSuccess = (deviceType) => {
    return {
        type: GET_SELECTED_DEVICE_TYPE_SUCCESS,
        payload: deviceType
    }
}
export const getDeviceTypeFailed = (error) => {
    return {
        type: GET_DEVICE_TYPE_REQUEST_FAILED,
        error: error
    }
}

const setDeviceTypeErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setDeviceTypeError(error))
    }
}

const setDeviceTypeError = (error) => {
    return {
        type: SET_DEVICE_TYPE_ERROR,
        error: error
    }
}

const setDeviceTypeErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

export const getDeviceType = () => {
    apiAuthorizer.authorize(deviceTypeAxios)
    return function (dispatch) {
        dispatch(getDeviceTypeRequest())
        deviceTypeAxios.deviceTypeControllerFind()
            .then(result => {
                const tableDatas = result.data
                console.log(tableDatas)
                dispatch(getDeviceTypeSuccess(tableDatas))
            })
            .catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setDeviceTypeErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}


export const getDeviceTypeById = (deviceTypeID) => {
    apiAuthorizer.authorize(deviceTypeAxios)
    return function (dispatch) {
        dispatch(getDeviceTypeRequest())
        deviceTypeAxios.deviceTypeControllerFindById(deviceTypeID)
            .then(response => {
                const deviceTypeData = [response.data]
                if (deviceTypeData === undefined) {
                    dispatch(setDeviceTypeErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getSelectedDeviceTypeSuccess(deviceTypeData))
                    dispatch(selectDeviceType(deviceTypeData[0].displayName))
                    dispatch(selectDeviceTypeId(deviceTypeData[0].id))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setDeviceTypeErrorRequest(error))
                    dispatch(setDeviceTypeErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const selectDeviceType = (deviceType) => {
    return {
        type: SELECT_DEVICE_TYPE,
        payload: deviceType
    }
}


export const selectDeviceTypeId = (deviceTypeID) => {
     return {
         type: SELECT_DEVICE_TYPE_ID,
         payload: deviceTypeID
     }
 }