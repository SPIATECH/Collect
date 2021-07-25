//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { useEffect }  from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import { 
    FirstLevelGroupParentId, 
    LocalStorageKeyId
 } from '../../common/GlobalConstants'
import { 
    getConfig,
    getAlerts,
    getDevices,
    getAllAlerts,
    getAlertInfo,
    getAlertGroup,
    getDeviceType,
    getNotification,
    getTagsByAlertId,
    getDeviceByTagId,
    getAllAlertsCount,
    getDeviceTypeById,
    getTagListByTagId,
    getAlertByAlertId,
    getTagGroupByTagId,
    getDeviceByDeviceId,
    getNotificationById,
    removeNotificationInfo,
    removeNotificationAlert
} from '../../redux'

const mapStatesToProps = (store) => {
    return {
        Auth: store.authentication,
        selectedTag: store.tags.selectedTag,
    }
}

function ProtectedRoute ({ component: Component, ...rest }) {

    var userInfo = JSON.parse(localStorage.getItem(LocalStorageKeyId))
    const dispatch = useDispatch()

    if(userInfo != null && userInfo.isAuthenticated){
        
        dispatch(getAlertInfo())
        
        if( rest.path === '/groups' ){
            dispatch(getAllAlertsCount())
            dispatch(getAlertGroup(FirstLevelGroupParentId));
        }
        else if( rest.path === '/groups/tags/alerts/addAlert' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['tags']) {
                    dispatch(getAlerts(hashItems['tags']))
                } 
            }
        }
        else if( rest.path === '/groups/tags/alerts/editAlert' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['alerts']) {
                    dispatch(getTagsByAlertId(hashItems['alerts']))
                    dispatch(getAlertByAlertId(hashItems['alerts']))
                    if(rest.selectedTag !="") dispatch(getTagGroupByTagId(rest.selectedTag))
                    if(rest.selectedTag !="") dispatch(getAlerts(rest.selectedTag))
                } 
            }
        }
        else if( rest.path === '/notifications' ){
            dispatch(getAlertGroup(FirstLevelGroupParentId));
            dispatch(getNotification());
            dispatch(removeNotificationAlert());
            dispatch(removeNotificationInfo());
        }
        else if( rest.path === '/notifications/AddNotification' ){
            dispatch(getAllAlerts())
        }
        
        else if( rest.path === '/notifications/EditNotification' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['notification']) {
                    dispatch(getAllAlerts());
                    dispatch(getNotificationById(hashItems['notification'], true))
                } 
            }
        }

        else if( rest.path === '/config' ){
            dispatch(getConfig())
        }
        else if( rest.path === '/datasources' ){
            dispatch(getDeviceType())
        }
        else if( rest.path === '/datasources/devices' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['device']) {
                    dispatch(getDeviceTypeById(hashItems['device']))
                    dispatch(getDevices(hashItems['device']))
                } 
            }
        }
        else if( rest.path === '/datasources/devices/editDevices' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['device'] && hashItems['edit']) {
                    dispatch(getDeviceTypeById(hashItems['device']))
                    dispatch(getDeviceByDeviceId(hashItems['edit']))
                } 
            }
        }
        else if( rest.path === '/datasources/devices/tags' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['device'] && hashItems['edit']) {
                    dispatch(getDeviceTypeById(hashItems['device']))
                    dispatch(getDeviceByDeviceId(hashItems['edit']))
                } 
            }
        }
        else if( rest.path === '/datasources/devices/tags/addTags' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['device'] && hashItems['edit']) {
                    dispatch(getDeviceTypeById(hashItems['device']))
                    dispatch(getDeviceByDeviceId(hashItems['edit']))
                } 
            }
        }
        else if( rest.path === '/datasources/devices/tags/editTags' ){
            var dynamicURL = window.location.href;
            var dynamicHash =  dynamicURL.split('?');

            var hashItems = {}
            if(dynamicHash.length > 1){
                dynamicHash[1].split('&').map(items => { 
                    let hashTemp = items.split('='); 
                    hashItems[hashTemp[0]] = hashTemp[1] 
                });
                if (hashItems['device'] && hashItems['edit']) {
                    dispatch(getDeviceTypeById(hashItems['device']))
                    dispatch(getTagListByTagId(hashItems['edit']))
                    dispatch(getDeviceByTagId(hashItems['edit']))
                } 
            }
        }
        
        return (
            <Route {...rest}
                render={(props) => {
                    return <Component {...props} />
                }}/>
        )
    }
    else{
        return (
            <Route {...rest}
                render={(props) => {
                    return <Redirect to={
                            {
                                pathname: "/",
                                state: {
                                    from: props.location
                                }
                            }
                        }/>
                }}
            />
        )
    }

}

export default connect(mapStatesToProps)(ProtectedRoute)
