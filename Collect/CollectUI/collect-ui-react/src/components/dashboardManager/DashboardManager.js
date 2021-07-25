//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react'
import Header from '../header/Header'
import { connect, useDispatch } from 'react-redux'

import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FolderIcon from '@material-ui/icons/Folder';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ErrorIcon from '@material-ui/icons/Error';
import TuneIcon from '@material-ui/icons/Tune';
import MemoryIcon from '@material-ui/icons/Memory';

// dashboard components
import GridItem from "./dashboardComponents/Grid/GridItem.js";
import GridContainer from "./dashboardComponents/Grid/GridContainer.js";
import Card from "./dashboardComponents/Card/Card.js";
import CardHeader from "./dashboardComponents/Card/CardHeader.js";
import CardIcon from "./dashboardComponents/Card/CardIcon.js";
import CardFooter from "./dashboardComponents/Card/CardFooter.js";

import './DashboardManager.scss'
import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";

import { 
    getDashDeviceCount,  
    getDashGroupCount, 
    getDashTagCount, 
    getDashAlertCount, 
    getDashNotificationCount 
} from '../../redux'
import {
    DashboardDeviceCountHeading, 
    DashboardDeviceCountSubHeading, 
    DashboardGroupCountHeading, 
    DashboardGroupCountSubHeading, 
    DashboardTagCountHeading, 
    DashboardTagCountSubHeading, 
    DashboardAlertCountHeading, 
    DashboardAlertCountSubHeading, 
    DashboardNotificationCountHeading, 
    DashboardNotificationCountSubHeading
} from '../../common/GlobalConstants';

const useStyles = makeStyles(styles)

const mapStateToProps = store => {
    return {
        dashDeviceCount: store.dashboard.dashDeviceCount,
        dashGroupCount: store.dashboard.dashGroupCount,
        dashTagCount: store.dashboard.dashTagCount,
        dashAlertCount: store.dashboard.dashAlertCount,
        dashNotificationCount: store.dashboard.dashNotificationCount,
    }
  }

function DashboardManager(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    dispatch(getDashDeviceCount())
    dispatch(getDashGroupCount())
    dispatch(getDashTagCount())
    dispatch(getDashAlertCount())
    dispatch(getDashNotificationCount())
    return(
        <div style={{height:"100%"}}>
            <Header title={props.title}  description={props.description}/>
            <div className="tabContentarea">
                <div className="dash-count-section">
                <GridContainer>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="warning" stats icon>
                            <CardIcon color="warning">
                                <MemoryIcon />
                            </CardIcon>
                            <p className={classes.cardCategory}>{DashboardDeviceCountHeading}</p>
                            <h3 className={classes.cardTitle}>
                                {props.dashDeviceCount}
                            </h3>
                            </CardHeader>
                            <CardFooter stats>
                            <div className={classes.stats}>
                                {DashboardDeviceCountSubHeading}
                            </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="warning" stats icon>
                            <CardIcon color="warning">
                                <FolderIcon />
                            </CardIcon>
                            <p className={classes.cardCategory}>{DashboardGroupCountHeading}</p>
                            <h3 className={classes.cardTitle}>
                                {props.dashGroupCount}
                            </h3>
                            </CardHeader>
                            <CardFooter stats>
                            <div className={classes.stats}>
                                {DashboardGroupCountSubHeading}
                            </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="success" stats icon>
                            <CardIcon color="success">
                                <LocalOfferIcon />
                            </CardIcon>
                            <p className={classes.cardCategory}>{DashboardTagCountHeading}</p>
                            <h3 className={classes.cardTitle}>
                                {props.dashTagCount}
                            </h3>
                            </CardHeader>
                            <CardFooter stats>
                            <div className={classes.stats}>
                                {DashboardTagCountSubHeading}
                            </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="danger" stats icon>
                            <CardIcon color="danger">
                                <ErrorIcon />
                            </CardIcon>
                            <p className={classes.cardCategory}>{DashboardAlertCountHeading}</p>
                            <h3 className={classes.cardTitle}>
                                {props.dashAlertCount}
                            </h3>
                            </CardHeader>
                            <CardFooter stats>
                            <div className={classes.stats}>
                                {DashboardAlertCountSubHeading}
                            </div>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                    <Card>
                        <CardHeader color="info" stats icon>
                        <CardIcon color="info">
                            <NotificationsActiveIcon />
                        </CardIcon>
                        <p className={classes.cardCategory}>{DashboardNotificationCountHeading}</p>
                        <h3 className={classes.cardTitle}>
                            {props.dashNotificationCount}
                        </h3>
                        </CardHeader>
                        <CardFooter stats>
                        <div className={classes.stats}>
                            {DashboardNotificationCountSubHeading}
                        </div>
                        </CardFooter>
                    </Card>
                    </GridItem>
                </GridContainer>
                </div>
                
            </div>
        </div>
    )
 }

 export default  connect(mapStateToProps)(DashboardManager)

 