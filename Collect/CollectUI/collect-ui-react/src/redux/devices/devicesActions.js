//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_DEVICES_REQUEST, 
    GET_DEVICES_REQUEST_SUCCESS,
    SELECT_DEVICE_BY_ID,
    SELECT_DEVICE, 
    SET_DEVICES_ERROR, 
    FILTER_DEVICES,
    REMOVE_SELECTED_DEVICE,
    SELECT_DEVICE_ID
} from './devicesActionTypes'

import { 
    APPHOST, 
    ToastMessageTypes, 
    AddDeviceSuccessMessage,
    UpdateDeviceSuccessMessage, 
    DeleteDeviceSuccessMessage
} from '../../common/GlobalConstants'

import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'
 
//const devicetypedeviceAxios = new api.DeviceDeviceTypeController({}, APPHOST);
const deviceAxios = new api.DeviceControllerApi({}, APPHOST);

export const getDevicesRequest = () => {
    return {
        type: GET_DEVICES_REQUEST
    }
}

export const getDevicesSuccess = (alerts) => {
    return {
        type: GET_DEVICES_REQUEST_SUCCESS,
        payload: alerts
    }
}

export const getDevicesSuccessbyID = (alerts) => {
    return {
        type: SELECT_DEVICE_BY_ID,
        payload: alerts
    }
}

const setDevicesErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setDevicesError(error))
    }
}

const setDevicesError = (error) => {
    return {
        type: SET_DEVICES_ERROR,
        error: error
    }
}

const setDevicesErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setDevicesSuccessToast = (message) => {
    return function (dispatch) {
        dispatch(setToastData({
            type: ToastMessageTypes.success,
            message: message
        }))
    }
}

export const getDevices = (selectedDeviceType) => {
    apiAuthorizer.authorize(deviceAxios)
    return function (dispatch) {
        dispatch(getDevicesRequest())
         var DeviceOrder = { order: ['createdOn DESC'],  where: { deviceTypeId: selectedDeviceType }};
        //var parentIdFilter = { where: { tagGroupId: selectedgroupsid } };
        deviceAxios.deviceControllerFind(JSON.stringify(DeviceOrder))
            .then(response => {
                const devicesData = response.data
                if (devicesData === undefined) {
                    dispatch(setDevicesErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getDevicesSuccess(devicesData))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setDevicesErrorRequest(error))
                    dispatch(setDevicesErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const addDevice = (deviceData) => {
    apiAuthorizer.authorize(deviceAxios)
    console.log(deviceData)
    console.log('----------deviceData-----------')
   // e.preventDefault();
    return function (dispatch) {
        deviceAxios.deviceControllerCreate(deviceData)
            .then(response => {
                console.log(response);
                dispatch(setDevicesSuccessToast(AddDeviceSuccessMessage))
            }).catch(error => {
                console.log(error)
                    console.log('----------error-----------')
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    
                    dispatch(setDevicesErrorToast(error))
                    dispatch(setDevicesErrorRequest(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const updateDevice = (updateId, updatedAlert) => {
    apiAuthorizer.authorize(deviceAxios)
    return function (dispatch) {
        deviceAxios.deviceControllerReplaceById(updateId, updatedAlert)
            .then(response => {
                console.log(response);
                dispatch(setDevicesSuccessToast(UpdateDeviceSuccessMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setDevicesErrorRequest(error))
                    dispatch(setDevicesErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const deleteDevice = (deleteDevice, deviceTypeID) => {
    apiAuthorizer.authorize(deviceAxios)
    return function (dispatch) {
        console.log("------------"+deleteDevice)
        deviceAxios.deviceControllerDeleteById(deleteDevice)
            .then(response => {
                console.log("alert deleted")
                dispatch(setDevicesSuccessToast(DeleteDeviceSuccessMessage))
                dispatch(getDevices(deviceTypeID))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setDevicesErrorRequest(error))
                    dispatch(setDevicesErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const getDeviceByDeviceId = (selectedDeviceid) => {
    apiAuthorizer.authorize(deviceAxios)
    return function (dispatch) {
        dispatch(getDevicesRequest())
        deviceAxios.deviceControllerFindById(selectedDeviceid)
            .then(response => {
                //console.log(alertsData[0].name)
                const alertsData = [response.data]
                if (alertsData === undefined) {
                    dispatch(setDevicesErrorRequest('Invalid data'))
                }
                else {
                    console.log(alertsData[0].name)
                    console.log(alertsData)
                    console.log('---------alertsDataalertsData-----------')
                    dispatch(getDevicesSuccessbyID(alertsData))
                    dispatch(selectDevice(alertsData[0].name))
                    dispatch(selectDeviceId(alertsData[0].id))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setDevicesErrorRequest(error))
                    dispatch(setDevicesErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const removeSelectedDevice = (alert) => {
    return {
        type: REMOVE_SELECTED_DEVICE,
        payload: ''
    }
}


export const selectDevice = (alert) => {
    return {
        type: SELECT_DEVICE,
        payload: alert
    }
}


export const selectDeviceId = (alert) => {
    return {
        type: SELECT_DEVICE_ID,
        payload: alert
    }
}

export const filterDevices = (list) => {
    return {
        type: FILTER_DEVICES,
        payload: list
    }
}
