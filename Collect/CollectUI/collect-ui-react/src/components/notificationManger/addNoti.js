//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { useState } from 'react'
import Header from '../header/Header';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { connect, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ErrorIcon from '@material-ui/icons/Error';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import './Notification.scss';
import { 
    getNotification, 
    selectNotificationAlertID, 
    selectNotificationAlertName, 
    addNotification, 
    updateNotification, 
    removeNotificationInfo, 
    isEditNotification, 
    getNotificationTagByTagId, 
    getNotificationAlertByAlertId 
} from '../../redux'
import { 
    NotificationTagsTableTagNameColumnHeader, 
    NotificationTagsTableFQTagNameColumnHeader, 
    NotificationTagsTableTagFunctionColumnHeader, 
    NotificationTagsTableTagConditionColumnHeader, 
    NotificationTagsTableTagValueColumnHeader, 
    NotificationNoAlertsListHeading, 
    NotificationAlertListCountperPage, 
    SelectedAlertHeading, 
    EnterKeyCode,
    AlertFunctionListDefault,
    ValueLabel
} from '../../common/GlobalConstants'

const mapStateToProps = store => {
    return {
        CollectAllAlerts: store.notifications.TagAlertsBucket,
        CollectTag: store.tags.CollectTag,
        selectedNotificationTag: store.notifications.selectedNotificationTag,
        selectedNotificationTagname: store.notifications.selectedNotificationTagname,
        TagAlertsBucket: store.notifications.TagAlertsBucket,
        SelectedAlertsBucket: store.notifications.SelectedAlertsBucket,
        selectedNotificationAlertid: store.notifications.selectedNotificationAlertid,
        selectedNotificationAlertname: store.notifications.selectedNotificationAlertname
    }
}

const styles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
  }))

function addNotificationAlert(props) {

    const dispatch = useDispatch();
    const [isSelectAlert, isSetSelectAlert] = React.useState(false);
    const [open, setOpen] = React.useState(true);
    const [keyNotRowSelect, setKeyNotRowSelect] = React.useState(false);
    const ref = React.createRef();
    const nref = React.createRef();
    const fref = React.createRef();
    const vref = React.createRef();
    const classes = styles();


    function onSelectedAlert(alertID, alertName, tagID) {
        isSetSelectAlert(true);
        dispatch(selectNotificationAlertID(alertID));
        dispatch(selectNotificationAlertName(alertName));
        dispatch(getNotificationTagByTagId(tagID));
    }

    function onRowSelect(row, e) {
        isSetSelectAlert(true);
        dispatch(selectNotificationAlertID(row.id));
        dispatch(selectNotificationAlertName(row.name));
        dispatch(getNotificationTagByTagId(row.tagId));
        dispatch(getNotificationAlertByAlertId(row.id));
    }

    function tagFormatter(cell, row) {
        return <ErrorIcon />;
    }

    function actionFormatter(cell, row) {
        return <DoubleArrowIcon />;
    }

    const options = {
        sizePerPageList: [{ text: NotificationAlertListCountperPage.default, value: NotificationAlertListCountperPage.default}, {text: NotificationAlertListCountperPage.option_1, value:NotificationAlertListCountperPage.option_1}, {text: NotificationAlertListCountperPage.option_2, value: NotificationAlertListCountperPage.option_2}],
        sizePerPage: NotificationAlertListCountperPage.default
    } 

    const selectRowProp = {
        mode: 'radio',
        bgColor: '#e6e6e6',
        hideSelectColumn: true,
        clickToSelect: true, 
        //selected: [ keyNotRowSelect ],
        onSelect: onRowSelect
    }

    const customStyle = (cell, row) => {
        setKeyNotRowSelect(row.id)
        return {
            outline:'rgb(19, 137, 220) solid 0px'
        };
    }

    const keyBoardNavProp = {
        enterToSelect: true,
        customStyle: customStyle
    }

    function showCondition(cell, row) {
        return cell.condition;
    }

    function showValue(cell, row) {
        return cell.value;
    }

    function showFunction(cell, row) {
        console.log(cell)
        if(cell === AlertFunctionListDefault){
            return ValueLabel
        }else{
            return cell +' ('+ValueLabel+')'
        }
    }
    
    function sortByValue(a, b, order, field) {
        if (order === 'desc') {
            return Number(b[field]['value']) - Number(a[field]['value']);
        } else {
            return Number(a[field]['value']) - Number(b[field]['value']);
        }
    }

    const bypassSortingAction = (e) => {
        console.log(e);
        e.stopPropagation();  
    }

    const handleNameFilter = (e) => {
        if(e.charCode == EnterKeyCode){
            var cValue = e.target.value
            ref.current.applyFilter(cValue);
        }
    }

    const handleTagNameFilter = (e) => {
        if(e.charCode == EnterKeyCode){
            var cValue = e.target.value
            nref.current.applyFilter(cValue);
        }
    }
    
    const handleValueFilter = (e) => {
        if(e.charCode == EnterKeyCode){
            var cValue = e.target.value
            vref.current.applyFilter(cValue);
        }
    }

    function renderSelectedAlert(props){
        if(props.SelectedAlertsBucket != undefined && props.SelectedAlertsBucket.length > 0){
            
           return  props.SelectedAlertsBucket.map((key, val) => {
                return(
                    <p key={key.id}  onClick={() => onSelectedAlert(key.id, key.name, key.tagId)}>
                        <span className="column-1"><ErrorIcon /></span>
                        <span className="column-2">{key.name}</span>
                        <span className="column-3">{key.FQTagName}</span>
                        <span className="column-4">{key.function}</span>
                        <span className="column-5">{key.alertinfo.condition}</span>
                        <span className="column-6">{key.alertinfo.value}</span>
                        <span className="column-7"><DoubleArrowIcon /></span>
                    </p>
                )
            })
        }
    }

    function renderItem(props) {
        
        if (props.CollectAllAlerts != undefined && props.CollectAllAlerts.length > 0) {
            return (
                <BootstrapTable   data={props.CollectAllAlerts} options={options} selectRow={selectRowProp} bordered={false} pagination hover  keyBoardNav={keyBoardNavProp}>
                    <TableHeaderColumn headerTitle={ false } dataField='id' dataFormat={tagFormatter} isKey={true} width='60'>&nbsp;</TableHeaderColumn>
                    <TableHeaderColumn  ref={ref} headerTitle={ false } dataField='name' filter={{ type: 'TextFilter'}} dataSort>{NotificationTagsTableTagNameColumnHeader} <OutlinedInput onKeyPress={handleNameFilter}  onClick={bypassSortingAction} id="standard-password-input5" className="filter-control" /></TableHeaderColumn>
                    <TableHeaderColumn  ref={nref} headerTitle={ false } dataField='FQTagName' filter={{ type: 'TextFilter' }} dataSort  width='400'>{NotificationTagsTableFQTagNameColumnHeader} <OutlinedInput onKeyPress={handleTagNameFilter}  onClick={bypassSortingAction} id="standard-password-input4" className="filter-control" /></TableHeaderColumn>
                    <TableHeaderColumn  headerTitle={ false } dataField='function' dataFormat={showFunction} dataSort width='250'>{NotificationTagsTableTagFunctionColumnHeader} </TableHeaderColumn>

                    <TableHeaderColumn  headerTitle={ false } dataField='alertinfo' isDummyField={true} dataFormat={showCondition}  width='200'>{NotificationTagsTableTagConditionColumnHeader}</TableHeaderColumn>
                    <TableHeaderColumn  ref={vref} headerTitle={ false } dataField='alertinfo' dataFormat={showValue} filter={{ type: 'TextFilter', delay: 2000 }} dataSort sortFunc={ sortByValue } filterValue={ showValue } width='140'>{NotificationTagsTableTagValueColumnHeader}<OutlinedInput onKeyPress={handleValueFilter}  onClick={bypassSortingAction} id="standard-password-input2" className="filter-control" /></TableHeaderColumn>
                    <TableHeaderColumn headerTitle={ false } dataFormat={ actionFormatter }  width='60'>&nbsp;</TableHeaderColumn>
                </BootstrapTable>
            )
        }
    }
    if (props.TagAlertsBucket.length > 0) {
        return (
            <div style={{height:"100%"}}>
                <Header title={props.title}  description={props.description} />
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <div className="section-alerts">
                                <div className="selected-row-alert" style={{ display: props.selectedNotificationAlertid ? 'block':'none' }}>
                                    <label>{SelectedAlertHeading}</label>
                                    {renderSelectedAlert(props)}
                                </div>
                                {renderItem(props)}
                            </div>
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
       
    } else {
        return (
            <div className="popup-empty-h"> 
                <Typography color="primary" gutterBottom={true} variant="subtitle1"> {NotificationNoAlertsListHeading} </Typography>
            </div>
        )
    }

}
export default connect(mapStateToProps)(addNotificationAlert)