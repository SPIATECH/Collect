//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import { combineReducers } from 'redux'
import groupReducer from './groups/groupReducer'
import tagReducer from './tags/tagReducer'
import alertsReducer from './alerts/alertsReducer'
import notificationReducer from './notificationManger/notificationReducer'
import configReducer from './config/configReducer'
import exportReducer from './export/exportReducer'
import importReducer from './import/importReducer'
import validationReducer from './validation/validationReducer'
import authenticationReducer from './authentication/authenticationReducer'
import toastMessageReducer from './toastMessage/toastMessageReducer'
import alertInfoReducer from './alertInfo/alertInfoReducer'
import dashboardReducer from './dashboard/dashboardReducer'
import dataSourceReducer from './dataSourceManager/dataSourceReducer'
import devicesReducer from './devices/devicesReducer'
import tagListReducer from './tagList/tagListReducer'

const rootReducer = combineReducers({
    groups : groupReducer,
    tags : tagReducer,
    alerts : alertsReducer,
    notifications: notificationReducer,
    config : configReducer,
    exportstore: exportReducer,
    importstore: importReducer,
    validation: validationReducer,
    authentication: authenticationReducer,
    toastMessage: toastMessageReducer,
    alertInfo: alertInfoReducer,
    dashboard: dashboardReducer,
    devicetype: dataSourceReducer,
    devices: devicesReducer,
    tagList: tagListReducer
})

export default rootReducer
