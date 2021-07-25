//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { APPHOST } from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { GET_ALERT_INFO_REQUEST, GET_ALERT_INFO_SUCCESS, GET_ALERT_INFO_FAILED } from '../alertInfo/alertInfoActionTypes';

const infoAxios = new api.InfoControllerApi(({}, APPHOST))

const getAlertInfoRequest = () => {
    return {
        type: GET_ALERT_INFO_REQUEST,
    }
}

const getAlertInfoSuccess = (info) => {
    return {
        type: GET_ALERT_INFO_SUCCESS,
        payload: info
    }
}

const getAlertInfoFailed = (error) => {
    return {
        type: GET_ALERT_INFO_FAILED,
        error: error
    }
}
export const getAlertInfo = () => {
    return function (dispatch) {
        dispatch(getAlertInfoRequest)
        infoAxios.infoControllerFind().then(response => {
            dispatch(getAlertInfoSuccess(response.data))
        }).catch(error => {
            const tempError = error.response;
            if (tempError) {
                error = tempError.data.error;
                console.log(error)
            }
            else {
                console.log(error)
            }
        })
    }
}

