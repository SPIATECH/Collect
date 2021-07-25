//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { 
    GET_TAG_TYPE_REQUEST,
    GET_TAG_TYPE_REQUEST_SUCCESS,
    SET_TAG_TYPE_ERROR,
    GET_TAGLIST_REQUEST, 
    GET_TAGLIST_REQUEST_SUCCESS,
    SELECT_TAGLIST_BY_ID,
    SELECT_TAGLIST, 
    SET_TAGLIST_ERROR, 
    FILTER_TAGLIST,
    REMOVE_SELECTED_TAGLIST,
    GET_TAG_DEVICE_REQUEST,
    SET_TAG_DEVICE_ERROR,
    SELECT_TAG_DEVICE_BY_ID,
    SELECT_TAG_DEVICE_NAME,
    SELECT_TAG_DEVICE_ID
} from './tagListActionTypes'

const initialState = {
    loading: false,
    error: null,
    TagTypeBucket: [],
    TagListBucket: [],
    selectedTagListBucket: [],
    FilterTagListBucket: [],
    selectedTagList: '',
    TagDeviceBucket: [],
    selectedTagDeviceName: '',
    selectedTagDeviceId: '',
}

const tagListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TAG_TYPE_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_TAG_TYPE_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            TagTypeBucket: action.payload,
            error: null
        }

        case SET_TAG_TYPE_ERROR: return {
            ...state,
            loading: false,
            error: action.error
        }

        case GET_TAGLIST_REQUEST: return {
            ...state,
            loading: true
        }

        case GET_TAGLIST_REQUEST_SUCCESS: return {
            ...state,
            loading: false,
            TagListBucket: action.payload,
            error: null
        }

        case SELECT_TAGLIST_BY_ID: return {
            ...state,
            loading: false,
            selectedTagListBucket: action.payload,
            error: null
        }

        case SET_TAGLIST_ERROR: return {
            ...state,
            loading: false,
            error: action.error
        }

        case SELECT_TAGLIST: return {
            ...state,
            selectedTagList: action.payload
        }

        case FILTER_TAGLIST: return {
            ...state,
            FilterTagListBucket: action.payload,
        }

        case REMOVE_SELECTED_TAGLIST: return {
            ...state,
            selectedTagListBucket: []
        }

        case GET_TAG_DEVICE_REQUEST: return {
            ...state,
            loading: true
        }

        case SELECT_TAG_DEVICE_BY_ID: return {
            ...state,
            loading: false,
            TagDeviceBucket: action.payload,
            error: null
        }

        case SET_TAG_DEVICE_ERROR: return {
            ...state,
            loading: false,
            error: action.error
        }

        case SELECT_TAG_DEVICE_NAME: return {
            ...state,
            selectedTagDeviceName: action.payload
        }

        case SELECT_TAG_DEVICE_ID: return {
            ...state,
            selectedTagDeviceId: action.payload
        }

        default: return state
    }
}

export default tagListReducer