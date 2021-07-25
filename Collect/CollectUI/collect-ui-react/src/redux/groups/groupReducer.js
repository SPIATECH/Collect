//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { GET_GROUPS_REQUEST , GET_GROUPS_REQUEST_SUCCESS , GET_GROUPS_REQUEST_FAILED, SELECT_GROUP, SELECT_GROUP_NAME } from './groupActionTypes'

const initialState = {
    loading: false,
    error : '',
    collectGroup: [],
    selectedGroup: '',
    selectedGroupName: ''
}

const groupReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_GROUPS_REQUEST : return {
            ...state,
            loading: true
        }

        case GET_GROUPS_REQUEST_SUCCESS: {
            
                return {
                    ...state,
                    loading: false,
                    collectGroup: action.payload,
                    error: ''
                }
        }

        case GET_GROUPS_REQUEST_FAILED : return {
            ...state,
            loading: false,
            collectGroup : [],
            error: action.error
        }

        case SELECT_GROUP : return {
            ...state,
            selectedGroup : action.payload
        }

        case SELECT_GROUP_NAME : return {
            ...state,
            selectedGroupName : action.payload
        }

        default : return state
    }
}

export default groupReducer