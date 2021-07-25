//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { SET_DATA, CLEAR_DATA } from './toastMessageActionTypes'

const initialState = {
    data: null
}

const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DATA: {
            return {
                ...state,
                data: action.payload
            }
        }

        case CLEAR_DATA: {
            return {
                ...state,
                data: null
            }
        }

        default: return state
    }
}

export default errorReducer