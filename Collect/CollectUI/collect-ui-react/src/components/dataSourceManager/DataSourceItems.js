//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

/* eslint-disable no-nested-ternary */
import React from 'react';
import { connect, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { NavLink as RouterLink } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'
import {selectDeviceType, getDeviceTypeById } from '../../redux'
import { 
  DeviceTypeEmptyMessage
} from '../../common/GlobalConstants'

const mapStateToProps = store => {
  return {
      DeviceTypeBucket: store.devicetype.DeviceTypeBucket
  }
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}));




function DataSourceItems(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  function openDeviceType(deviceTypeID) {
    //dispatch(getDevices(deviceTypeID))
    dispatch(selectDeviceType(deviceTypeID));
    dispatch(getDeviceTypeById(deviceTypeID));
    window.location = window.location.origin+"/#/datasources/devices?device="+deviceTypeID
  }

  function renderDeviceType(props){
    if(props.DeviceTypeBucket.length > 0){
      return (
        props.DeviceTypeBucket.map((key, val) => {
            return <Grid item xs={4}  key={key.id}>
              <Paper className={classes.paper}>
                <span onClick={() => openDeviceType(key.id)} className="q-link">{key.displayName}</span>
              </Paper>
            </Grid>
        })
      )
    }
  }
  if(props.DeviceTypeBucket.length > 0){
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          {renderDeviceType(props)}
        </Grid>
      </div>
    );
  }else{
    return (
      <Typography className="no-filter-found" color="primary" gutterBottom={true} variant="subtitle1"> {DeviceTypeEmptyMessage} </Typography>
    );
  }
}

export default connect(mapStateToProps)(DataSourceItems)