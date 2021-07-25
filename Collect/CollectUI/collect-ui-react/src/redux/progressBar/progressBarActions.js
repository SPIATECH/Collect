//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { SET_PROGRESS_DATA, CLEAR_PROGRESS_DATA } from './progressBarActionTypes'

export const setProgressBar = (data) => {
    return {
        type: SET_PROGRESS_DATA,
        payload: data
    }
}

export const clearProgressBar = () => {
    return {
        type: CLEAR_PROGRESS_DATA
    }
}