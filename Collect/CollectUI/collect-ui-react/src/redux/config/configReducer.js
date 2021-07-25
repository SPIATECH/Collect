//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { GET_CONFIG_REQUEST, GET_CONFIG_REQUEST_SUCCESS, GET_CONFIG_REQUEST_FAILED, POST_CONFIG_REQUEST, POST_CONFIG_REQUEST_SUCCESS, POST_CONFIG_REQUEST_FAILED } from './configActionTypes'
import { 
    SMTPConfigID, 
    SMSConfigID, 
} from '../../common/GlobalConstants'

const initialState = {
    loading: false,
    error: '',
    smtp: null,
    sms: null
}

const configReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONFIG_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_CONFIG_REQUEST_SUCCESS: {
            const config = action.payload
            return{
                ...state,
                loading: false,
                smtp: config.id == SMTPConfigID ? config : state.smtp,
                sms: config.id == SMSConfigID ? config : state.sms 
            }
        }

        case GET_CONFIG_REQUEST_FAILED: {
            return {
                ...state,
                loading: false,
                error: action.error,
                sms: null
            }
        }

        case POST_CONFIG_REQUEST: return {
            ...state,
            loading: true,
        }

        case POST_CONFIG_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            error: '',
        }

        case POST_CONFIG_REQUEST_FAILED: return {
            ...state,
            lloading: false,
            error: action.error
        }

        default: return state
    }
}

export default configReducer