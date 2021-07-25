//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { LocalStorageKeyId } from './GlobalConstants'

class apiAuthorizer{
    authorize(api,token){
        if(token && api){
            console.log("Authorizing user on login");
            api.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }
        else if(api && token == null){
            console.log("Authorizing an already logged in user")
            const token = JSON.parse(localStorage.getItem(LocalStorageKeyId)).token
            api.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }
    }   
}

export default new apiAuthorizer()