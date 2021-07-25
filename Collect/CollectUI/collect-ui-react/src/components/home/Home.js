//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React , { Component } from 'react'
import { Provider } from 'react-redux'
import LeftSidePanel from '../leftSidePanel/LeftSidePanel'
import DashboardManager from '../dashboardManager/DashboardManager'
import Groups from '../groups/Groups'
import Tags from '../tags/Tags'
import AlertManger from '../alerts/Alerts'
import AddAlert from '../alerts/addAlert'
import EditAlert from '../alerts/editAlert'
import NotificationManager from '../notificationManger/NotificationManager'
import AddNotificationAlert from '../notificationManger/NotificationAdd'
import EditNotificationAlert from '../notificationManger/NotificationEdit'
import DataSourceManager from '../dataSourceManager/DataSourceManager'
import Devices from '../dataSourceManager/devices/Devices'
import AddDevices from '../dataSourceManager/devices/addDevices'
import EditDevices from '../dataSourceManager/devices/editDevices'
import DeviceTag from '../dataSourceManager/devices/TagList'
import AddTags from '../dataSourceManager/devices/addTags'
import EditTags from '../dataSourceManager/devices/editTags'
import Login from '../login/Login'
import store from '../../redux/store'
import './Home.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import ProtectedRoute from '../login/ProtectedRoute'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import ConfigurationManager from '../configurationManager/ConfigurationManager'
import ToastNotification from '../toastNotification/ToastNotification'
import { theme } from '../../common/GlobalConstants'

class Home extends Component{
   
    render() {
        return(
            <Provider store={store}>
                <ThemeProvider theme={theme}> 
                    <Router>
                        <LeftSidePanel/>
                        <div className="homeRightContainer">
                            <Switch>
                                <Route exact path="/"
                                    component={(props) => <Login
                                    {...props}/>}/>
                                <ProtectedRoute path="/dashboard" 
                                    exact
                                    component={(props) => <DashboardManager {...props}
                                    title={theme.props.HeaderTexts.alertsHeaderTitle}
                                    description={theme.props.HeaderTexts.alertsHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/datasources" 
                                    exact
                                    component={(props) => <DataSourceManager {...props}
                                    title={theme.props.collectLocals.dataSourceHeaderTitle}
                                    description={theme.props.collectLocals.dataSourceHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/datasources/devices" 
                                    exact
                                    component={(props) => <Devices {...props}
                                    title={theme.props.collectLocals.dataSourceHeaderTitle}
                                    description={theme.props.collectLocals.dataSourceHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/datasources/devices/addDevices" 
                                    exact
                                    component={(props) => <AddDevices {...props}
                                    title={theme.props.collectLocals.dataSourceHeaderTitle}
                                    description={theme.props.collectLocals.dataSourceHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/datasources/devices/editDevices" 
                                    exact
                                    component={(props) => <EditDevices {...props}
                                    title={theme.props.collectLocals.dataSourceHeaderTitle}
                                    description={theme.props.collectLocals.dataSourceHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/datasources/devices/tags" 
                                    exact
                                    component={(props) => <DeviceTag {...props}
                                    title={theme.props.collectLocals.dataSourceHeaderTitle}
                                    description={theme.props.collectLocals.dataSourceHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/datasources/devices/tags/addTags" 
                                    exact
                                    component={(props) => <AddTags {...props}
                                    title={theme.props.collectLocals.dataSourceHeaderTitle}
                                    description={theme.props.collectLocals.dataSourceHeaderDescription}/>
                                    } /> 
                                <ProtectedRoute path="/datasources/devices/tags/editTags" 
                                    exact
                                    component={(props) => <EditTags {...props}
                                    title={theme.props.collectLocals.dataSourceHeaderTitle}
                                    description={theme.props.collectLocals.dataSourceHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/groups" 
                                    exact
                                    component={(props) => <Groups {...props}
                                    title={theme.props.HeaderTexts.groupsHeaderTitle}
                                    description={theme.props.HeaderTexts.groupsHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/groups/tags" 
                                    exact
                                    component={(props) => <Tags {...props}
                                    title={theme.props.HeaderTexts.tagsHeaderTitle}
                                    description={theme.props.HeaderTexts.tagsHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/groups/tags/alerts" 
                                    exact
                                    component={(props) => <AlertManger {...props}
                                    title={theme.props.HeaderTexts.alertsHeaderTitle}
                                    description={theme.props.HeaderTexts.alertsHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/groups/tags/alerts/addAlert" 
                                    exact
                                    component={(props) => <AddAlert {...props}
                                    title={theme.props.HeaderTexts.alertsHeaderTitle}
                                    description={theme.props.HeaderTexts.alertsHeaderDescription}/>
                                    } />
                                <ProtectedRoute path="/groups/tags/alerts/editAlert" 
                                    exact
                                    component={(props) => <EditAlert {...props}
                                    title={theme.props.HeaderTexts.alertsHeaderTitle}
                                    description={theme.props.HeaderTexts.alertsHeaderDescription}/>
                                    } />
                                <ProtectedRoute exact path="/notifications" 
                                    exact
                                    component={(props) => <NotificationManager {...props}
                                    title={theme.props.HeaderTexts.notificationsHeaderTitle}
                                    description={theme.props.HeaderTexts.notificationsHeaderDescription}/>
                                    } />
                                <ProtectedRoute exact path="/notifications/AddNotification" 
                                    exact
                                    component={(props) => <AddNotificationAlert {...props}
                                    title={theme.props.HeaderTexts.notificationsHeaderTitle}
                                    description={theme.props.HeaderTexts.notificationsHeaderDescription}/>
                                    } />
                                <ProtectedRoute exact path="/notifications/EditNotification" 
                                    exact
                                    component={(props) => <EditNotificationAlert {...props}
                                    title={theme.props.HeaderTexts.notificationsHeaderTitle}
                                    description={theme.props.HeaderTexts.notificationsHeaderDescription}/>
                                    } />
                                <ProtectedRoute exact path="/config"
                                    exact
                                    component={(props) => <ConfigurationManager {...props}
                                        title={theme.props.HeaderTexts.configHeaderTitle}
                                        description={theme.props.HeaderTexts.configHeaderDescription}/>
                                    }/>
                            </Switch>
                            <ToastNotification theme={theme}/>
                        </div>
                    </Router>
                </ThemeProvider>
            </Provider>
        )
    }
}

export default Home
