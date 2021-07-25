//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { SHOULD_ASK_FOR_CONFIRMATION } from './validationActionTypes'
import { UnsavedDataWarningMessage } from '../../common/GlobalConstants'

function eventHandler(ev) {
    ev.preventDefault();
    return ev.returnValue = UnsavedDataWarningMessage;
}

export const setAskForConfirmation = (askForConfirmation) => {
    return {
        type: SHOULD_ASK_FOR_CONFIRMATION,
        value: askForConfirmation
    }
}

export const shouldAskForConfirmation = (askForConfirmation) => {
    return function (dispatch) {
        if (askForConfirmation) {
            console.log("Adding event listener")
            window.addEventListener("beforeunload", eventHandler);
        }
        else {
            console.log("Removing event listener")
            window.removeEventListener("beforeunload", eventHandler)
        }
        dispatch(setAskForConfirmation(askForConfirmation))
    }
}