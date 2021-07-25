//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { SET_DATA, CLEAR_DATA } from './toastMessageActionTypes'

export const setToastData = (data) => {
    return {
        type: SET_DATA,
        payload: data
    }
}

export const clearData = () => {
    return {
        type: CLEAR_DATA
    }
}