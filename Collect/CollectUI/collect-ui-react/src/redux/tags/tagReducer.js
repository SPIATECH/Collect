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

const initialState = {
    loading: false,
    error: '',
    CollectTag: [],
    selectedTag: '',
    selectedTagname: '',
    selectFQTagname: '',
}

const tagReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TAGS_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_TAGS_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            CollectTag: action.payload,
            error: ''
        }

        case GET_TAGS_REQUEST_FAILED: return {
            ...state,
            loading: false,
            CollectTag: [],
            error: action.error
        }

        case SELECT_TAG: return {
            ...state,
            selectedTag: action.payload,
        }

        case SELECT_TAGNAME: return {
            ...state,
            selectedTagname: action.payload,
        }

        case SELECT_FQTAGNAME: return {
            ...state,
            selectFQTagname: action.payload,
        }

        case REMOVE_TAG_INFO: return {
            ...state,
            loading: false,
            CollectTag: [],
            error: ''
        }

        case REMOVE_SELECTED_TAG: return {
            ...state,
            selectedTag: false,
        }

        case REMOVE_SELECTED_TAG_NAME: return {
            ...state,
            selectedTagname: false,
        }

        default: return state
    }
}

export default tagReducer