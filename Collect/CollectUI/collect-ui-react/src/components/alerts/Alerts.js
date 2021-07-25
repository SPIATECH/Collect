//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { useState, useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import Header from '../header/Header'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl'
import FilterListIcon from '@material-ui/icons/FilterList';
//import AddAlertDialog from './AddAlert'
import AlertItem from './AlertItem'
import './Alerts.scss'
import { 
    addAlert, 
    getAlerts, 
    setToastData, 
    updateAlert, 
    filterAlerts,
    getTagGroupByTagId,
    getAlertByAlertId,
    getTagsByTagId,
    removeSelectedAlert
} from '../../redux'
import { 
    UnsavedDataWarningMessage, 
    AddAlertButtonLabel, 
    ToastMessageTypes, 
    AlertsMaxLimitReachedError, 
    AlertsTotalMaxLimitReachedError,
    SearchLabel, 
    AlertNotFoundMessage, 
    AlertListEmptyMessage, 
} from '../../common/GlobalConstants'

const mapStateToProps = store => {
    return {
        CollectAlerts: store.alerts.CollectTagAlerts,
        SelectedTag: store.tags.selectedTag,
        selectFQTagname: store.tags.selectFQTagname,
        totalAlertsMaxCount: store.alertInfo.info.config.alerttotalmax,
        singleTagAlertsMaxCount: store.alertInfo.info.config.alertmax,
        totalAlertsCount: store.alerts.totalAlertsCount,
        FilterAlertBucket: store.alerts.FilterAlertBucket
    }
}

const styles = makeStyles(theme => ({
    root: {
        padding: 0,
        position: 'relative',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    },
    topContentContainer: {
        height: 'calc(100% - 40px)',
        paddingRight: 5,
        paddingLeft: 5
    },
    bottomButtonContainer: {
        marginTop: '20px',
        height: '40px',
        bottom: 0,
        padding: 0,
        position: 'absolute',
        bottom: 0,
    }
}))

function Alerts(props) {
    const [open, setOpen] = React.useState(false);
    const [dialogData, setDialogData] = React.useState(null);
    const [alertList, setAlertList] = React.useState([]);
    var filterResult = [];
    var alertListDatas = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        var queryString = window.location.href;
        var hash =  queryString.split('?');
        var paramItems = {}
        if(hash.length > 1){
            hash[1].split('&').map(hk => { 
            let temp = hk.split('='); 
                paramItems[temp[0]] = temp[1] 
            });

            if (paramItems['tags']) {
                //dispatch(removeSelectedAlert());
                dispatch(getTagsByTagId(paramItems['tags']));
                dispatch(getAlerts(paramItems['tags']));
                dispatch(getTagGroupByTagId(paramItems['tags']));
            } 
        }
    }, []);

    const handleClickOpen = () => {
        if (props.totalAlertsCount >= props.totalAlertsMaxCount) {
            dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: AlertsTotalMaxLimitReachedError
            }))
            return
        }else if(props.CollectAlerts.length >= props.singleTagAlertsMaxCount){
            dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: AlertsMaxLimitReachedError
            }))
            return
        }
        else {
            setOpen(true);
            window.location = window.location.origin+"/#/groups/tags/alerts/addAlert?tags="+props.SelectedTag;
        }
    };

    const editAction = (data) => {
        //dispatch(removeSelectedAlert());
        //dispatch(getAlertByAlertId(data.alertId));
        window.location = window.location.origin+"/#/groups/tags/alerts/editAlert?alerts="+data.alertId;
    };

    
    function handleSearch(event){
        dispatch(filterAlerts(filterResult))
        alertList.length = 0;
        let searchValue = event.target.value.toLowerCase();
        if(searchValue !=""){
            console.log('-----------Search Value------------');
            console.log(searchValue);
            const alertDataList = props.CollectAlerts;
            
            for(var i = 0, len = alertDataList.length; i < len; i++){
                var alertDataName = alertDataList[i].name.toLowerCase();
                if(alertDataName.indexOf(searchValue) !== -1){
                    alertList.push(alertDataList[i]);
                }
            }

            if(alertList.length == 0){
                alertList.push(AlertNotFoundMessage)
            }
        }
    }

    const renderItem = (props) => {
        
        if(alertList[0] == AlertNotFoundMessage){
            return (
                <ListItem className="no-result">{AlertNotFoundMessage}</ListItem>
            )
            
        }else{
            if(alertList.length == 0){
                alertListDatas = props.CollectAlerts;
            }else{
                alertListDatas = alertList;
            }
            
            return (
                alertListDatas.map((alert) =>

                    // Each list item should have a unique key 
                    <ListItem key={alert.id}>
                        <AlertItem disabled={true}
                            isForm={false}
                            tagId={alert.tagId}
                            alertId={alert.id}
                            alertName={alert.name}
                            alertEnable={alert.enabled}
                            alertDeadband={alert.deadbandvalue}
                            alertActivationDelay={alert.activationDelay}
                            alertUnit={alert.unit}
                            alertFQTagname={alert.FQTagName}
                            alertFunction={alert.function}
                            alertValue={alert.alertinfo.value}
                            alertCondition={alert.alertinfo.condition}
                            alertInterval={alert.alertinfo.interval}
                            alertInfoUnit={alert.alertinfo.unit}
                            editAction={editAction} />
                    </ListItem>
                )
            )
        }
    }

    const classes = styles();
    if (props.CollectAlerts.length != 0) {
        return (
            <div style={{height:"100%"}}>
                <Header title={props.title}  description={props.description}/>
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <section className="alert-filters">
                                <div className="add-common-btn">
                                    <Button variant="outlined"
                                        onClick={handleClickOpen}
                                        focusRipple={false} 
                                        style={{
                                            marginBottom: 15,
                                            marginTop: 15
                                        }} >
                                        <AddOutlinedIcon color="primary" /> {AddAlertButtonLabel}
                                    </Button>
                                </div>
                                <div className="float-right">
                                    <form noValidate autoComplete="off">
                                    <FormControl className="full-width">
                                        <OutlinedInput
                                        onInput={handleSearch}
                                        id="filter-notifications"
                                        type='search'
                                        placeholder={SearchLabel}
                                        endAdornment={<InputAdornment position="end"><FilterListIcon /></InputAdornment>}
                                        aria-describedby="filled-weight-helper-text"
                                        />
                                    </FormControl>
                                    </form>
                                </div>
                            </section>
                            <List className={classes.list} >
                                {renderItem(props)}
                            </List>
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
    }
    else {
        return (
            <div style={{height:"100%"}}>
                <Header title={props.title}  description={props.description}/>
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <div className="default-empty-alert-container">
                                <Typography color="primary"
                                    gutterBottom={true}
                                    variant="subtitle1">
                                    {AlertListEmptyMessage}
                                </Typography>
                                <Button variant="outlined"
                                focusRipple={false} 
                                    onClick={handleClickOpen}>
                                    <AddOutlinedIcon color="primary" />
                                </Button>
                            </div>
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Alerts)