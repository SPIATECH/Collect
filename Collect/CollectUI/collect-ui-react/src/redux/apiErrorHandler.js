//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { userLogout } from './authentication/authenticationActions';
import { UserLoggedOutMessage } from '../common/GlobalConstants'

export const handleError = (dispatch,error) => {
    if (error.statusCode === 401) {
        console.log(UserLoggedOutMessage)
        dispatch(userLogout())
    }
}

