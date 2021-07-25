//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
    GET_TAG_TYPE_REQUEST,
    GET_TAG_TYPE_REQUEST_SUCCESS,
    SET_TAG_TYPE_ERROR,
    GET_TAGLIST_REQUEST, 
    GET_TAGLIST_REQUEST_SUCCESS,
    SELECT_TAGLIST_BY_ID,
    SELECT_TAGLIST, 
    SET_TAGLIST_ERROR, 
    FILTER_TAGLIST,
    REMOVE_SELECTED_TAGLIST,
    GET_TAG_DEVICE_REQUEST,
    SET_TAG_DEVICE_ERROR,
    SELECT_TAG_DEVICE_BY_ID,
    SELECT_TAG_DEVICE_NAME,
    SELECT_TAG_DEVICE_ID
} from './tagListActionTypes'

import { 
    APPHOST, 
    ToastMessageTypes, 
    AddTagSuccessMessage,
    UpdateTagSuccessMessage, 
    DeleteTagSuccessMessage
} from '../../common/GlobalConstants'

import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'
 
//const devicetypedeviceAxios = new api.DeviceDeviceTypeController({}, APPHOST);
const deviceTagAxios = new api.DeviceTagControllerApi({}, APPHOST);
const tagAxios = new api.TagControllerApi({}, APPHOST);
const tagTypeAxios = new api.TagTypeControllerApi({}, APPHOST);
const tagDeviceAxios = new api.TagDeviceControllerApi({}, APPHOST);
export const getTagListRequest = () => {
    return {
        type: GET_TAGLIST_REQUEST
    }
}

export const getTagDeviceRequest = () => {
    return {
        type: GET_TAG_DEVICE_REQUEST
    }
}

export const getTagTypeRequest = () => {
    return {
        type: GET_TAG_TYPE_REQUEST
    }
}

export const getTagTypeSuccess = (alerts) => {
    return {
        type: GET_TAG_TYPE_REQUEST_SUCCESS,
        payload: alerts
    }
}

export const getTagListSuccess = (alerts) => {
    return {
        type: GET_TAGLIST_REQUEST_SUCCESS,
        payload: alerts
    }
}

export const getTagListSuccessbyID = (alerts) => {
    return {
        type: SELECT_TAGLIST_BY_ID,
        payload: alerts
    }
}

export const getTagDeviceSuccessbyID = (alerts) => {
    return {
        type: SELECT_TAG_DEVICE_BY_ID,
        payload: alerts
    }
}

const setTagTypeErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setTagTypeError(error))
    }
}

const setTagDeviceErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setTagDeviceError(error))
    }
}

const setTagTypeError = (error) => {
    return {
        type: SET_TAG_TYPE_ERROR,
        error: error
    }
}

const setTagDeviceError = (error) => {
    return {
        type: SET_TAG_DEVICE_ERROR,
        error: error
    }
}

const setTagListErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setTagListError(error))
    }
}

const setTagListError = (error) => {
    return {
        type: SET_TAGLIST_ERROR,
        error: error
    }
}

const setTagDeviceErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setTagTypeErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setTagListErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

const setTagListSuccessToast = (message) => {
    return function (dispatch) {
        dispatch(setToastData({
            type: ToastMessageTypes.success,
            message: message
        }))
    }
}

export const getTagType = (deviceType) => {
    apiAuthorizer.authorize(tagAxios)
    return function (dispatch) {
        dispatch(getTagTypeRequest())
        var TagTypeOrder = {where: { devicetype: deviceType }};
        tagTypeAxios.tagTypeControllerFind(JSON.stringify(TagTypeOrder))
            .then(response => {
                const devicesData = response.data
                if (devicesData === undefined) {
                    dispatch(setTagTypeErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getTagTypeSuccess(devicesData))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagTypeErrorRequest(error))
                    dispatch(setTagTypeErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getTagList = (deviceId) => {

    apiAuthorizer.authorize(deviceTagAxios)
    return function (dispatch) {
        dispatch(getTagListRequest())
         var DeviceOrder = {
            order: ['createdOn DESC']
         }
        deviceTagAxios.deviceTagControllerFind(deviceId, JSON.stringify(DeviceOrder))
            .then(response => {
                const devicesData = response.data
                
                if (devicesData === undefined) {
                    dispatch(setTagListErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getTagListSuccess(devicesData))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log("--7777----------"+error)
                    dispatch(setTagListErrorRequest(error))
                    dispatch(setTagListErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const addTagList = (newAlert) => {
    apiAuthorizer.authorize(tagAxios)
    console.log(newAlert)
   // e.preventDefault();
    return function (dispatch) {
        tagAxios.tagControllerCreate(newAlert)
            .then(response => {
                console.log(response);
                dispatch(setTagListSuccessToast(AddTagSuccessMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagListErrorToast(error))
                    dispatch(setTagListErrorRequest(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const updateTagList = (updateId, updatedTag) => {
    apiAuthorizer.authorize(tagAxios)
    return function (dispatch) {
        tagAxios.tagControllerReplaceById(updateId, updatedTag)
            .then(response => {
                console.log(response);
                dispatch(setTagListSuccessToast(UpdateTagSuccessMessage))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagListErrorRequest(error))
                    dispatch(setTagListErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const deleteTagList = (deleteTag, deviceId) => {
    apiAuthorizer.authorize(tagAxios)
    return function (dispatch) {
        console.log("------------"+deleteTag)
        tagAxios.tagControllerDeleteById(deleteTag)
            .then(response => {
                console.log("alert deleted")
                dispatch(setTagListSuccessToast(DeleteTagSuccessMessage))
                dispatch(getTagList(deviceId))
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagListErrorRequest(error))
                    dispatch(setTagListErrorToast(error))
                    handleError(dispatch, error)
                }
            })
    }
}

export const getDeviceByTagId = (selectedTagid) => {
    apiAuthorizer.authorize(tagDeviceAxios)
    return function (dispatch) {
        dispatch(getTagDeviceRequest())
        tagDeviceAxios.tagDeviceControllerGetDevice(selectedTagid)
            .then(response => {
                //console.log(selectedAlertid)
                const alertsData = [response.data]
                if (alertsData === undefined) {
                    dispatch(setTagDeviceErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getTagDeviceSuccessbyID(alertsData))
                    dispatch(selectTagDeviceName(alertsData[0].name))
                    dispatch(selectTagDeviceId(alertsData[0].id))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagDeviceErrorRequest(error))
                    dispatch(setTagDeviceErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getTagListByTagId = (selectedTagid) => {
    apiAuthorizer.authorize(tagAxios)
    return function (dispatch) {
        dispatch(getTagListRequest())
        tagAxios.tagControllerFindById(selectedTagid)
            .then(response => {
                //console.log(selectedAlertid)
                const alertsData = [response.data]
                if (alertsData === undefined) {
                    dispatch(setTagListErrorRequest('Invalid data'))
                }
                else {
                    console.log(alertsData)
                    console.log('-----getTagListSuccessbyID-----')
                    dispatch(getTagListSuccessbyID(alertsData))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagListErrorRequest(error))
                    dispatch(setTagListErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const removeSelectedTagList = (alert) => {
    return {
        type: REMOVE_SELECTED_TAGLIST,
        payload: ''
    }
}

export const selectTagList = (alert) => {
    return {
        type: SELECT_TAGLIST,
        payload: alert
    }
}
export const selectTagDeviceName = (alert) => {
    return {
        type: SELECT_TAG_DEVICE_NAME,
        payload: alert
    }
}

export const selectTagDeviceId = (alert) => {
    return {
        type: SELECT_TAG_DEVICE_ID,
        payload: alert
    }
}


export const filterTagList = (list) => {
    return {
        type: FILTER_TAGLIST,
        payload: list
    }
}
