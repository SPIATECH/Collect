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

const initialState = {
    loading: false,
    error: '',
    DeviceTypeBucket: [],
    SelectedDeviceTypeBucket: [],
    selectedDeviceType: '',
    selectedDeviceTypeId: '',
}

const dataSourceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DEVICE_TYPE_REQUEST: return {
            ...state,
            loading: true
        }

        case SET_DEVICE_TYPE_ERROR: return {
            ...state,
            loading: false,
            SelectedDeviceTypeBucket: [],
            error: action.error
        }
        case GET_DEVICE_TYPE_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            DeviceTypeBucket: action.payload,
            error: ''
        }
        case GET_SELECTED_DEVICE_TYPE_SUCCESS: return {
            ...state,
            loading: false,
            SelectedDeviceTypeBucket: action.payload,
            error: ''
        }

        case GET_DEVICE_TYPE_REQUEST_FAILED: return {
            ...state,
            loading: false,
            DeviceTypeBucket: [],
            error: action.error
        }

        case SELECT_DEVICE_TYPE: return {
            ...state,
            selectedDeviceType: action.payload,
        }

        case SELECT_DEVICE_TYPE_ID: return {
            ...state,
            selectedDeviceTypeId: action.payload,
        }

        default: return state
    }
}
export default dataSourceReducer