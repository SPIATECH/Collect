//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { SHOULD_ASK_FOR_CONFIRMATION } from './validationActionTypes'

const initialState = {
    askForConfirmation: false
}

const validationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOULD_ASK_FOR_CONFIRMATION: {
            console.log(action.value)
            return {
                ...state,
                askForConfirmation: action.value
            }
        }

        default: return state
    }
}

export default validationReducer