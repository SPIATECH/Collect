//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_TAGS_REQUEST, 
    GET_TAGS_REQUEST_SUCCESS, 
    GET_TAGS_REQUEST_FAILED, 
    SELECT_TAG, SELECT_TAGNAME, 
    REMOVE_TAG_INFO, 
    REMOVE_SELECTED_TAG, 
    SELECT_FQTAGNAME,
    REMOVE_SELECTED_TAG_NAME
} from './tagActionTypes'
import { APPHOST, ToastMessageTypes,  } from '../../common/GlobalConstants'
import { setToastData } from '../'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import apiAuthorizer from '../../common/apiAuthorizer'

var tagAxios = new api.TagControllerApi({}, APPHOST);
var alertTagAxios = new api.AlertTagControllerApi({}, APPHOST);

export const getTagRequest = () => {
    return {
        type: GET_TAGS_REQUEST
    }
}

export const getTagSuccess = (tags) => {
    return {
        type: GET_TAGS_REQUEST_SUCCESS,
        payload: tags
    }
}

export const getTagFailed = (error) => {
    return {
        type: GET_TAGS_REQUEST_FAILED,
        error: error
    }
}

export const getTag = (selectedgroupsid) => {
    apiAuthorizer.authorize(tagAxios)
    return function (dispatch) {
        dispatch(getTagRequest())
        console.log(selectedgroupsid)
        var parentIdFilter = { where: { tagGroupId: selectedgroupsid } };
        tagAxios.tagControllerFind(JSON.stringify(parentIdFilter))
            .then(result => {
                const tagDatas = result.data
                //console.log(tagDatas)
                dispatch(getTagSuccess(tagDatas))
            })
            .catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    handleError(dispatch, error)
                }
            });
    }
}

const setTagErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setTagError(error))
    }
}

const setTagError = (error) => {
    return {
        type: GET_TAGS_REQUEST_FAILED,
        error: error
    }
}

const setTagErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

export const getTagsByAlertId = (selectedAlertId) => {
    apiAuthorizer.authorize(alertTagAxios)
    return function (dispatch) {
        dispatch(getTagRequest())
        alertTagAxios.alertTagControllerGetTag(selectedAlertId)
            .then(response => {
                const tagDatas = [response.data]
                if (tagDatas === undefined) {
                    dispatch(setTagErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getTagSuccess(tagDatas))
                    dispatch(selectTag(tagDatas[0].id))
                    dispatch(selectTagname(tagDatas[0].name))
                    dispatch(selectFQTagName(tagDatas[0].parentFullName +'.'+ tagDatas[0].name))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagErrorRequest(error))
                    dispatch(setTagErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getTagsByTagId = (selectedTagId) => {
    apiAuthorizer.authorize(tagAxios)
    return function (dispatch) {
        dispatch(getTagRequest())
        tagAxios.tagControllerFindById(selectedTagId)
            .then(response => {
                const tagDatas = [response.data]
                if (tagDatas === undefined) {
                    dispatch(setTagErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getTagSuccess(tagDatas))
                    dispatch(selectTag(tagDatas[0].id))
                    dispatch(selectTagname(tagDatas[0].name))
                    dispatch(selectFQTagName(tagDatas[0].parentFullName +'.'+ tagDatas[0].name))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagErrorRequest(error))
                    dispatch(setTagErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const selectTag = (tagID) => {
    console.log(tagID)
    return {
        type: SELECT_TAG,
        payload: tagID
    }
}

export const selectTagname = (tagName) => {
    console.log(tagName)
    return {
        type: SELECT_TAGNAME,
        payload: tagName
    }
}

export const selectFQTagName = (FQTagName) => {
    console.log(FQTagName)
    return {
        type: SELECT_FQTAGNAME,
        payload: FQTagName
    }
}

export const removeSelectedTag = () => {
    return {
        type: REMOVE_SELECTED_TAG,
        payload: ''
    }
}
export const removeSelectedTagName = () => {
    return {
        type: REMOVE_SELECTED_TAG_NAME,
        payload: ''
    }
}

export const removeTagFromCollectTag = () => {
    return {
        type: REMOVE_TAG_INFO,
        payload: ''
    }
}