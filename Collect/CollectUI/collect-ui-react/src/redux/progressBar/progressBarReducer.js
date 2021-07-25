//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { SET_PROGRESS_DATA, CLEAR_PROGRESS_DATA } from './progressBarActionTypes'

const initialState = {
    progress: null
}

const progressBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROGRESS_DATA: {
            return {
                ...state,
                progress: action.payload
            }
        }

        case CLEAR_PROGRESS_DATA: {
            return {
                ...state,
                progress: null
            }
        }

        default: return state
    }
}

export default progressBarReducer