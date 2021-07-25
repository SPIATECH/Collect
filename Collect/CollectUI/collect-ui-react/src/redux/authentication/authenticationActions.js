//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILED } from './authenticationActionTypes'
import { LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILED } from './authenticationActionTypes'
import { getAlertInfo } from '../../redux'
import { 
    APPHOST,
    LocalStorageKeyId
} from '../../common/GlobalConstants'
import * as api from '../../api/index'
import store from '../store'
import apiAuthorizer from '../../common/apiAuthorizer'


const userLoginAxios = new api.UserControllerApi({}, APPHOST)


function saveUserInfoToLocalStorage(newToken){
    console.log("Saving user info started ...")
    const userConfig = store.getState().alertInfo
    var userLanguage = null
    if(userConfig && userConfig.info && userConfig.info.config.language){
        userLanguage = userConfig.info.config.language
    }
    const userInfo = {
        loading: false,
        isAuthenticated: true,
        isError: false,
        errorText: "",
        token: newToken,
        language: userLanguage
    }
    localStorage.setItem(LocalStorageKeyId,JSON.stringify(userInfo))
    console.log("Saving user info finished...")
    return userInfo;
}

function clearLocalStorage(){
    localStorage.clear()
}

const getUserConfig = () => new Promise((resolve,reject) => {
    store.dispatch(getAlertInfo())
    resolve()
})

export const userLogin = (data) => {
    return function (dispatch) {
        getUserConfig()
        .then(() => {
            if(data.email && data.password){
                localStorage.clear()
                console.log("Logging in with username and password ... ")
                dispatch(userLoginRequest())
                userLoginAxios.userControllerLogin(data)
                .then(response => {
                    const token = response.data.token
                    loginSuccess(token)
                })
                .catch(error => {
                    var errorMessage = error.response.data != null && error.response.data.error ? error.response.data.error.message : error.response.data
                    console.log(error.response)
                    console.log("Failed to log in!!!")
                    if (error.response.data.error != undefined) {
                        dispatch(userLoginFailed(error.response.data.error.statusCode))
                    }
                })
            }else if(data.token){
                console.log("User already logged in ...")
                loginSuccess(data.token)
            }else{
                console.log("Cannot login, invalid credentials")
            }
        })
    }
}

export const userLogout = () => {
    return function (dispatch) {
        console.log("User logging out ...")
        dispatch(userLogoutRequest())
        clearLocalStorage()
        dispatch(userLogoutSuccess())
    }
}

function loginSuccess(token){
    apiAuthorizer.authorize(userLoginAxios,token)
    userLoginAxios.userControllerFind()
    .then( response => {
        console.log("Saving alert user info to local on successfull login...")
        const userInfo = saveUserInfoToLocalStorage(token)
        console.log("Saving user info to local on successfull login finished...")
        console.log("User logged in successfully")
        store.dispatch(userLoginSuccess(userInfo))
    }).catch(error => {
        console.log(error)
        error = error.response.data.error
        if(error && error.statusCode === 401){
            console.log("Session expired, logging out....")
        }
    })
    
}

const userLoginRequest = () => {
    return {
        type: LOGIN_USER_REQUEST
    }
}

const userLoginSuccess = (token) => {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: token
    }
}

const userLoginFailed = (error) => {
    return {
        type: LOGIN_USER_FAILED,
        error: error
    }
}

const userLogoutRequest = () => {
    return {
        type: LOGOUT_USER_REQUEST
    }
}

const userLogoutSuccess = () => {
    return {
        type: LOGOUT_USER_SUCCESS,
    }
}


