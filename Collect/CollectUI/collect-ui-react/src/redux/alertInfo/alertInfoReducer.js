//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { GET_ALERT_INFO_REQUEST, GET_ALERT_INFO_SUCCESS, GET_ALERT_INFO_FAILED } from '../alertInfo/alertInfoActionTypes';

const initialState = {
    info: null,
    error: null,
    loading: false
}

const alertInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALERT_INFO_REQUEST: {
            return {
                ...state,
                loading: true
            }
        }

        case GET_ALERT_INFO_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                info: action.payload
            }
        }

        case GET_ALERT_INFO_FAILED: {
            return {
                ...state,
                loading: false,
                error: action.error,
                info: null
            }
        }

        default: {
            return state
        }
    }
}

export default alertInfoReducer