//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import './LeftSidePanel.scss'
import ImprtDialog from '../Import/Import'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SettingsIcon from '@material-ui/icons/Settings'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import ErrorIcon from '@material-ui/icons/Error';
import HomeIcon from '@material-ui/icons/Home';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux'
import { DashboardLinkLabel, AlertsLinkLabel, NotificationsLinkLabel, SettingsLinkLabel, SoftwareVersionLabel } from '../../common/GlobalConstants'


/*======== Collect Properties ========*/
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Route } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { DataSourceLinkLabel } from '../../common/GlobalConstants'
import MemoryIcon from '@material-ui/icons/Memory';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
/*======== End Collect Properties ========*/


const mapStateToProps = store => {
    return {
        alertInfo: store.alertInfo,
        selectedDeviceType: store.devicetype.selectedDeviceType,
        selectedDeviceTypeId: store.devicetype.selectedDeviceTypeId,
        selectedDevice: store.devices.selectedDevice,
        selectedDeviceId: store.devices.selectedDeviceId,
        selectedTagDeviceName: store.tagList.selectedTagDeviceName,
        selectedTagDeviceId: store.tagList.selectedTagDeviceId,
        selectedGroup: store.groups.selectedGroup,
        selectedGroupName: store.groups.selectedGroupName,
        selectedTag: store.tags.selectedTag,
        selectedTagname: store.tags.selectedTagname,
        selectedAlert: store.alerts.selectedAlert,
        selectedAlertName: store.alerts.selectedAlertName,
        SelectedAlertsBucket: store.notifications.SelectedAlertsBucket,
        SelectedNotification: store.notifications.SelectedNotificationBucket,
    }
}



function LeftSidePanel(props) {
    const LinkRouter = (props) => <Link {...props} component={RouterLink} />;
   
    const toggleMenuOpen = () => {
        document.body.classList.add('toggleMenu');
    };

    const toggleMenuClose = () => {
        document.body.classList.remove('toggleMenu');
    }

    const urlExtraParms = [];

    function renderVersion() {
        if (props.alertInfo && props.alertInfo.info) {
            return props.alertInfo.info.version
        }
        else {
            return " "
        }
    }

    var deviceName = props.selectedDevice ? props.selectedDevice : props.selectedTagDeviceName;
    var groupName = props.selectedGroupName ? props.selectedGroupName : "Groups";
    var tagName = props.selectedTagname ? props.selectedTagname : "Tags";
    var NotificationAlertAddName = props.SelectedAlertsBucket !== undefined && props.SelectedAlertsBucket.length > 0 ? props.SelectedAlertsBucket[0].name +' (Add Notification)' : "Add Notification (Select Alert)";
    var NotificationAlertName = props.SelectedAlertsBucket !== undefined && props.SelectedAlertsBucket.length > 0 ? '-' + props.SelectedAlertsBucket[0].name : "";
    var NotificationName =  props.SelectedNotification !== undefined  && props.SelectedNotification.length > 0 ? props.SelectedNotification[0].name  : "";

    const breadcrumbNameMap = {
        '/dashboard': 'Dashboard',
        '/datasources': 'Data Sources',
        '/datasources/devices': props.selectedDeviceType,
        '/datasources/devices/addDevices': "Add Device",
        '/datasources/devices/editDevices': deviceName + " (Edit device) ",
        '/datasources/devices/tags': deviceName + " - Tags",
        '/datasources/devices/tags/addTags': "Add Tags",
        '/datasources/devices/tags/editTags': "Edit Tags",
        '/groups': groupName,
        '/groups/tags': tagName,
        '/groups/tags/alerts': 'Alerts',
        '/groups/tags/alerts/addAlert': 'Add Alert',
        '/groups/tags/alerts/editAlert': props.selectedAlertName + " (Edit Alert) ",
        '/notifications': 'Notifications',
        '/notifications/AddNotification': NotificationAlertAddName,
        '/notifications/EditNotification': NotificationName +' '+ NotificationAlertName + " (Edit Notification)",
        '/config': 'Config',
    };
    
    var currentUrl = window.location.href;
    var urlParts = currentUrl.split("/#/");
    var currentPage = urlParts[1];
    var urlPage = urlParts[1].split("?");
    var urlPath = urlPage[0];

    if(urlPath === 'notifications/AddNotification'){
        urlExtraParms.push("")
        urlExtraParms.push("")
    }

    if(urlPath === 'notifications/EditNotification'){
        urlExtraParms.push("")
        urlExtraParms.push("")
    }

    if(urlPath === 'groups/tags'){
        urlExtraParms.push("")
    }

    if(urlPath === 'groups/tags/alerts'){
        urlExtraParms.push("")
        urlExtraParms.push("?group="+props.selectedGroup)
    }

    if(urlPath === 'groups/tags/alerts/addAlert'){
        urlExtraParms.push("")
        urlExtraParms.push("?group="+props.selectedGroup)
        urlExtraParms.push("?tags="+props.selectedTag)
    }

    if(urlPath === 'groups/tags/alerts/editAlert'){
        urlExtraParms.push("")
        urlExtraParms.push("?group="+props.selectedGroup)
        urlExtraParms.push("?tags="+props.selectedTag)
    }

    if(urlPath === 'datasources'){
        urlExtraParms.push("")
    }

    if(urlPath === 'datasources/devices'){
        urlExtraParms.push("")
    }

    if(urlPath === 'datasources/devices/addDevices'){
        urlExtraParms.push("")
        urlExtraParms.push("?device="+props.selectedDeviceTypeId)
    }

    if(urlPath === 'datasources/devices/editDevices'){
        urlExtraParms.push("")
        urlExtraParms.push("?device="+props.selectedDeviceTypeId)
    }

    if(urlPath === 'datasources/devices/tags'){
        urlExtraParms.push("")
        urlExtraParms.push("?device="+props.selectedDeviceTypeId)
    }

    if(urlPath === 'datasources/devices/tags/addTags'){
        urlExtraParms.push("")
        urlExtraParms.push("?device="+props.selectedDeviceTypeId)
        urlExtraParms.push("?device="+props.selectedDeviceTypeId+"&edit="+props.selectedDeviceId)
    }

    if(urlPath === 'datasources/devices/tags/editTags'){
        urlExtraParms.push("")
        urlExtraParms.push("?device="+props.selectedDeviceTypeId)
        urlExtraParms.push("?device="+props.selectedDeviceTypeId+"&edit="+props.selectedTagDeviceId)
    }

    if(currentPage !== ""){
        return (
            <div>
                <Route>
                    {({ location }) => {
                        const pathnames = location.pathname.split('/').filter((x) => x);
                        return (
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} className="breadcrumb" aria-label="breadcrumb">

                            <LinkRouter color="inherit" to="/dashboard">
                            Dashboard
                            </LinkRouter>
                            {pathnames.map((value, index) => {
                                const last = index === pathnames.length - 1;
                                const to = `/${pathnames.slice(0, index + 1).join('/')}`; 
                               // console.log("index" + index);
                                if(to !== "/dashboard"){
                                   // console.log(to);
                                    return last ? (
                                        <Typography color="textPrimary" key={to}>
                                        {breadcrumbNameMap[to]}
                                        </Typography>
                                    ) : (
                                        <LinkRouter color="inherit" to={to+urlExtraParms[index]} key={to}>
                                        {breadcrumbNameMap[to]}
                                        </LinkRouter>
                                    );
                                }
                                
                            })}
                        </Breadcrumbs>
                        );
                    }}
                </Route>
                <nav className="leftSidePanel">
                    <div className="sidebarBody">
                        <div className="main-menu">
                            <ul className="nav">
                                <li className="nav-item">
                                    <Link component={RouterLink} to='/dashboard'>
                                        <HomeIcon />
                                        <span className="linkTitle">{DashboardLinkLabel}</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                        <Link component={RouterLink} to='/datasources'>
                                        <MemoryIcon />
                                        <span className="linkTitle">{DataSourceLinkLabel}</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link component={RouterLink} to='/groups'>
                                        <ErrorIcon />
                                        <span className="linkTitle">{AlertsLinkLabel}</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link component={RouterLink} to='/notifications'>
                                        <NotificationsActiveIcon />
                                        <span className="linkTitle">{NotificationsLinkLabel}</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link component={RouterLink} to='/config'>
                                        <SettingsIcon />
                                        <span className="linkTitle">{SettingsLinkLabel}</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <ImprtDialog />
                        <div className="versionInfo">
                            <Tooltip title={SoftwareVersionLabel} placement="top" arrow><p>{renderVersion()}</p></Tooltip>
                        </div>
                        <div className="menu-collapse-icon">
                            <span className="menuToggleOpen" onClick={toggleMenuOpen}><ArrowForwardIosIcon /></span>
                            <span className="menuToggleClose" onClick={toggleMenuClose}><ArrowBackIosIcon /></span>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }else{
        return (
            //to hide leftpane while login
            <div></div>
        )
    }
   
}

export default connect(mapStateToProps)(LeftSidePanel)
