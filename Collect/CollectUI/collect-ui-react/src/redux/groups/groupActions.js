//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { GET_GROUPS_REQUEST, GET_GROUPS_REQUEST_SUCCESS, GET_GROUPS_REQUEST_FAILED, SELECT_GROUP, SELECT_GROUP_NAME } from './groupActionTypes'
import { 
    APPHOST,
    ToastMessageTypes, 
    CollectUnGroupId,
    FirstLevelGroupParentId,
    UnGroupName
} from '../../common/GlobalConstants'
import * as api from '../../api/index';
import { handleError } from '../apiErrorHandler'
import { setToastData } from '../'
import apiAuthorizer from '../../common/apiAuthorizer'

const taggroupaxios = new api.TagGroupControllerApi({}, APPHOST);
const tagTagGroupAxios = new api.TagTagGroupControllerApi({}, APPHOST);

export const getGroupRequest = () => {
    return {
        type: GET_GROUPS_REQUEST
    }
}

export const getGroupSuccess = (groups) => {
    return {
        type: GET_GROUPS_REQUEST_SUCCESS,
        payload: groups
    }
}

export const getAlertGroup = (parentGroupId) => {
    return function (dispatch) {
        apiAuthorizer.authorize(taggroupaxios)
        dispatch(getGroupRequest())
        var groups = []
        getGroups(parentGroupId).then(value => {
            groups = value.data
            console.log("Getting groups completed")
            console.log(groups)
            groups.forEach(group => {
                if (group.subgroups != undefined) {
                    getGroups(group.id).then(value => {
                        console.log("Getting subgroups of " + group.name)
                        console.log(value.data)
                        group.subgroups = value.data
                        dispatch(getGroupSuccess({}))
                        dispatch(getGroupSuccess(groups))
                    })
                }
            })
            dispatch(getGroupSuccess(groups))
            console.log("Getting subgroups of ")
        }).catch(error => {
            console.log(error.response)
        })
    }
}

async function getGroups(groupId) {
    console.log("Getting groups started")
    var filter = {
            include: [{ relation: 'subgroups' }],
            where: {
                parentId: groupId
            }
    }
    var response = taggroupaxios.tagGroupControllerFind(JSON.stringify(filter))
    return response
}

const setTagGroupErrorRequest = (error) => {
    return function (dispatch) {
        dispatch(setTagGroupError(error))
    }
}

const setTagGroupError = (error) => {
    return {
        type: GET_GROUPS_REQUEST_FAILED,
        error: error
    }
}

const setTagGroupErrorToast = (error) => {
    return function (dispatch) {
        dispatch(setToastData({
            ...error,
            type: ToastMessageTypes.error
        }))
    }
}

export const getGroupById = (groupId) => {
    apiAuthorizer.authorize(taggroupaxios)
    return function (dispatch) {
        dispatch(getGroupRequest())
        taggroupaxios.tagGroupControllerFindById(groupId)
            .then(response => {
                const groupsData = [response.data]
                if (groupsData == undefined) {
                    dispatch(setTagGroupErrorRequest('Invalid data'))
                }
                else {
                    dispatch(getGroupSuccess(groupsData))
                    dispatch(selectGroup(groupId))
                    dispatch(selectGroupName(groupsData[0].name))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagGroupErrorRequest(error))
                    dispatch(setTagGroupErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const getTagGroupByTagId = (selectedTagId) => {
    apiAuthorizer.authorize(tagTagGroupAxios)
    return function (dispatch) {
        dispatch(getGroupRequest())
        tagTagGroupAxios.tagTagGroupControllerGetTagGroup(selectedTagId)
            .then(response => {
                const tagGroupData = [response.data]
                if (tagGroupData == undefined) {
                    dispatch(setTagGroupErrorRequest('Invalid data'))
                }
                else {
                    //console.log(tagGroupData)
                    dispatch(getGroupSuccess(tagGroupData))
                    dispatch(selectGroup(tagGroupData[0].id))
                    dispatch(selectGroupName(tagGroupData[0].name))
                }
            }).catch(error => {
                const tempError = error.response;
                if (tempError) {
                    error = tempError.data.error;
                    console.log(error)
                    dispatch(setTagGroupErrorRequest(error))
                    dispatch(setTagGroupErrorToast(error))
                    handleError(dispatch, error)
                }
            });
    }
}

export const selectGroup = (groupID) => {
    return {
        type: SELECT_GROUP,
        payload: groupID
    }
} 

export const selectGroupName = (groupName) => {
    return {
        type: SELECT_GROUP_NAME,
        payload: groupName
    }
}


export const removeSelectGroupName = () => {
    return {
        type: SELECT_GROUP_NAME,
        payload: ''
    }
} 

export const createUnGroup = () => {
    let tagGroups = {
        "version": "1",
        "id": CollectUnGroupId,
        "name": UnGroupName,
        "parentId": FirstLevelGroupParentId,
        "parentFullName": UnGroupName,
        "additionalProp1": {}
    }

    apiAuthorizer.authorize(taggroupaxios)

    return function (dispatch) {
        taggroupaxios.tagGroupControllerFindById(CollectUnGroupId).then(response => {
            console.log("ungroup already exist")
        }).catch(error => {
            taggroupaxios.tagGroupControllerCreate(tagGroups).then(response => {
                console.log("ungroup created")
            }).catch(error => {
                console.log("ungroup already exist1")
                handleError(dispatch, error)
            })
            
        })
    }
}
