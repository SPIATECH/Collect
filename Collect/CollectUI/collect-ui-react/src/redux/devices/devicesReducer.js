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

const initialState = {
    loading: false,
    error: null,
    DevicesBucket: [],
    selectedDeviceBucket: [],
    FilterDevicesBucket: [],
    selectedDevice: '',
    selectedDeviceId: ''
}

const devicesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DEVICES_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_DEVICES_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            DevicesBucket: action.payload,
            error: null
        }

        case SELECT_DEVICE_BY_ID: return {
            ...state,
            loading: false,
            selectedDeviceBucket: action.payload,
            error: null
        }

        case SET_DEVICES_ERROR: return {
            ...state,
            loading: false,
            error: action.error
        }

        case SELECT_DEVICE: return {
            ...state,
            selectedDevice: action.payload
        }

        case SELECT_DEVICE_ID: return {
            ...state,
            selectedDeviceId: action.payload
        }

        case FILTER_DEVICES: return {
            ...state,
            FilterDevicesBucket: action.payload,
        }

        case REMOVE_SELECTED_DEVICE: return {
            ...state,
            selectedDeviceBucket: []
        }

        default: return state
    }
}

export default devicesReducer