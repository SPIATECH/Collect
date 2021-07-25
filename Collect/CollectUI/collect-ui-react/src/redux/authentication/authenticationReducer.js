//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILED, LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS } from './authenticationActionTypes'
import { LoginErrorText } from '../../common/GlobalConstants'

const initialState = {
    loading: false,
    isAuthenticated: false,
    isError: false,
    errorText: "",
    token: '',
}

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER_REQUEST: return {
            ...state,
            loading: true,
        }

        case LOGIN_USER_SUCCESS: {
            return action.payload
        }

        case LOGIN_USER_FAILED: {

            const error = JSON.stringify(action.error)
            return {
                ...state,
                loading: false,
                isError: true,
                errorText: LoginErrorText,
                isAuthenticated: false,
                token: ''
            }
        }

        case LOGOUT_USER_REQUEST: return {
            ...state,
            loading: true,
        }

        case LOGOUT_USER_SUCCESS: return {
            ...state,
            loading: false,
            error: {
                isUserError: false,
                userErrorText: "",
                isPasswordError: false,
                passwordErrorText: ""
            },
            isAuthenticated: false,
            token: ''
        }

        default: return state
    }
}

export default authenticationReducer