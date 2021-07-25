//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MemoryIcon from '@material-ui/icons/Memory';
import Button from '@material-ui/core/Button'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import { Row, Col } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux'
import Header from '../../header/Header'
import './Devices.scss'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {getDeviceTypeById, getDevices, addDevice, getDeviceByDeviceId, updateDevice, deleteDevice, selectDevice } from '../../../redux'
import { 
    NoDevicesInfoMessage, 
    TableNameColumnHeader, 
    DeviceListCountperPage, 
    EnterKeyCode,
    AddDeviceButtonLabel,
    DeleteDeviceWarningHeading, 
    DeleteDeviceWarningMessage,
    DeleteLabel, 
    NoButtonLabel, 
    YesButtonLabel, 
    EscKeyCode,
    TagListLabel
} from '../../../common/GlobalConstants';

const mapStateToProps = store => {
    return {
        SelectedDeviceTypeBucket: store.devicetype.SelectedDeviceTypeBucket,
        DevicesBucket: store.devices.DevicesBucket,
        selectedDeviceBucket: store.devices.selectedDeviceBucket
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
    fullWidthCenter:{
        textAlign: 'center',
        width:'100%'
    }
}));

const formStyle = makeStyles(theme => ({
    root: {
        width: "100%",
        '& > *': {
            margin: 10,
        },
        '& .MuiOutlinedInput-input': {
            padding: '12.5px 7px',
            fontSize: '16px'
        },
        '& .MuiFormLabel-root': {
            fontSize: '16px',
            background: '#FFF',
            padding: '0 7px'
        }
    }
}))



function Devices(props){
    const classes = useStyles();
    const dispatch = useDispatch()
    const [selectedDeviceId, setSelectedDeviceId] = React.useState(false);
    const [isShow, isConfirm] = useState(false);
    const [deviceDeleteID, setDeviceDeleteID] = useState('');
    const ref = React.createRef();
    const additionalProperties = [];
    const additionalHeader = [];

    useEffect(() => {
        var queryString = window.location.href;
        var hash =  queryString.split('?');
        var paramItems = {}
        if(hash.length > 1){
            hash[1].split('&').map(hk => { 
            let temp = hk.split('='); 
            paramItems[temp[0]] = temp[1] 
            });

            if (paramItems['device']) {
                setSelectedDeviceId(paramItems['device'])
            } 
        }
    }, []);
   
    const deleteButtonClicked = (deviceId) => {
        console.log(deviceId)
        if(deviceId != ""){
            isConfirm(true);
            setDeviceDeleteID(deviceId)
        }
        
    }

    console.log('SelectedDeviceTypeBucket');
    console.log(props.SelectedDeviceTypeBucket);

    const tagListButtonClicked = (row) => {
       /*  console.log(row);
        console.log('row************'); */
    }

    function deleteFile(){
        var typeID = selectedDeviceId.toLowerCase()
        dispatch(deleteDevice(deviceDeleteID, typeID))
        isConfirm(false);
    }

    function onCancel() {
        isConfirm(false);
    }

    function handleCloseDelete(e){
        if (e.keyCode == EscKeyCode) {
            console.log("esc key pressed")
            isConfirm(false);
        }
    }

    function addDevice() {
        window.location = window.location.origin+"/#/datasources/devices/addDevices?device="+selectedDeviceId;
    }

    function confirmDeleteAction() {
    
        return(
          <Dialog 
            className="alert-select-modal" 
            aria-labelledby='customized-dialog-title' 
            open={isShow} 
            onKeyDown={handleCloseDelete} 
            maxWidth='md' 
            size='medium'>
            <DialogContent>
                <Container>
                <Row className="show-grid">
                    <Col xs={12} md={12}>
                    <div className="delepopContent">
                        <span><DeleteOutlineOutlinedIcon /></span>
                        <h6>{DeleteDeviceWarningHeading}</h6>
                        <p>{DeleteDeviceWarningMessage}</p>
                    </div>
                    </Col>
                    <Col xs={12} md={12}>
                        <div className="popdele-btns text-center">
                        <Button onClick={() => onCancel()} color="primary" variant="outlined" color="primary" type="submit">  {NoButtonLabel} </Button>
                        <Button onClick={() => deleteFile()} color="primary" variant="outlined" color="primary" type="submit">  {YesButtonLabel} </Button>
                        </div>
                    </Col>
                </Row>
                </Container>
            </DialogContent>
            </Dialog>
        )
    }

    function setTableHeader(item){
        var deviceTypeProp = props.SelectedDeviceTypeBucket[0].properties
        var headerName = true
        deviceTypeProp.map((key, val) => {
            for(const items in key){
                if(key[items] === item){
                    headerName = key.displayname
                }
            }
        })
        return headerName
    }

    function setTableColumn(item){
        var deviceTypeProp = props.SelectedDeviceTypeBucket[0].properties
        var showintable = false

        deviceTypeProp.map((key, val) => {
            for(const items in key){
                if(key[items] === item){
                    showintable = key.showintable
                }
            }
        })
        return showintable
    }

    function onRowSelect(deviceName, deviceId) {
        dispatch(selectDevice(deviceName))
        dispatch(getDeviceByDeviceId(deviceId));
        window.location = window.location.origin+"/#/datasources/devices/editDevices?device="+selectedDeviceId+"&edit="+deviceId
    }

    function openTagList(deviceName, deviceId) {
        dispatch(selectDevice(deviceName))
        dispatch(getDeviceByDeviceId(deviceId));
        window.location = window.location.origin+"/#/datasources/devices/tags?device="+selectedDeviceId+"&edit="+deviceId
    }

    function nameFormatter(cell, row) {
        return <span className="q-link" onClick={() => onRowSelect(row.name, row.id)}>{cell}</span>
    }

    function tagFormatter(cell, row) {
        return <MemoryIcon />;
    }

    function actionFormatter(cell, row) {
        return <div><Tooltip title={TagListLabel} placement="top" arrow>
            <span onClick={() => openTagList(row.name, row.id)}>
                <LocalOfferOutlinedIcon />
            </span></Tooltip><Tooltip title={DeleteLabel} placement="top" arrow><span id={cell}><DeleteOutlineOutlinedIcon onClick={() => deleteButtonClicked(cell)} /></span></Tooltip></div>;
    }

    const customStyle = (cell, row) => {
        return {
            outline:'rgb(19, 137, 220) solid 0px'
        };
    }

    const options = {
        sizePerPageList: [
            { 
                text: DeviceListCountperPage.default, 
                value: DeviceListCountperPage.default
            }, 
            {
                text: DeviceListCountperPage.option_1, 
                value:DeviceListCountperPage.option_1
            }, 
            {
                text: DeviceListCountperPage.option_2,
                 value: DeviceListCountperPage.option_2
            }],
        sizePerPage: DeviceListCountperPage.default
    } 

    const selectRowProp = {
      mode: 'radio',
      bgColor: '#e6e6e6',
      hideSelectColumn: true,  // enable hide selection column.
      clickToSelect: true,  // you should enable clickToSelect, otherwise, you can't select column.
      //selected: [ keyRowSelect ],
      className: 'custom-select-class',
      onSelect: onRowSelect
    }

    const handleTagSearch = (e) => {
     
        if(e.charCode == EnterKeyCode){
            var cValue = e.target.value
            ref.current.applyFilter(cValue);
        }
    }

    const bypassSortingAction = (e) => {
        console.log(e);
        e.stopPropagation();  
    }

    const keyBoardNavProp = {
        customStyle: customStyle
    }


    if (props.DevicesBucket != undefined && props.DevicesBucket.length > 0) {
        console.log(props.DevicesBucket)
        console.log('DevicesBucket')
        var additionalProp = "";
        for(var i = 0; i < props.DevicesBucket.length; i++){
            additionalProp = props.DevicesBucket[i]
            
            for (const item in additionalProp){
                var res = setTableColumn(item)
                if(res){
                    if(item in additionalProperties){
                        console.log('exist')
                    }else{
                        additionalProperties[item] = [];
                    }
                   additionalProperties[item].push(additionalProp[item]);
                }
            }
        }

        for (const items in additionalProperties) {
            additionalHeader.push(
                <TableHeaderColumn key={ items } dataField={ items }>{ setTableHeader(items) }</TableHeaderColumn>
            );
        }
        
        return (
            <div style={{height:"100%"}}>
                <Header title={props.title}  description={props.description}/>
                <div className="tabContentarea">
                    <div>
                     {confirmDeleteAction()}
                    </div>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <div className="deviceListHead">
                                <div className="add-common-btn pos-abs">
                                    <Button 
                                        onClick={() => addDevice()}
                                        variant="outlined"
                                        focusRipple={false}
                                        style={{
                                            marginBottom: 15,
                                            marginTop: 15,
                                            paddingRight:"5px"
                                        }} >
                                        <AddOutlinedIcon color="primary" /> {AddDeviceButtonLabel}
                                    </Button>
                                </div>
                                <div className="section-tags section-device-list">
                                    <BootstrapTable data={props.DevicesBucket} options={options} bordered={false} pagination hover keyBoardNav={keyBoardNavProp}>
                                        <TableHeaderColumn headerTitle={ false } dataField='id' dataFormat={tagFormatter}></TableHeaderColumn>
                                        <TableHeaderColumn ref={ref} headerTitle={ false } dataField='name' dataFormat={nameFormatter} filter={{type:'TextFilter'}} isKey={true} dataSort>
                                            {TableNameColumnHeader} 
                                            <div>
                                            <OutlinedInput onKeyPress={handleTagSearch}  onClick={bypassSortingAction} id="standard-password-input" className="filter-control" />
                                            </div>
                                        </TableHeaderColumn>
                                        {additionalHeader}
                                        <TableHeaderColumn headerTitle={ false } dataField='id' dataFormat={actionFormatter}></TableHeaderColumn>
                                    </BootstrapTable>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
    }
    else {
        return (
            <div  style={{height:"100%"}}>
                <Header title={props.title}  description={props.description}/>
                <div className="tabContentarea deviceListHead">
                    <div  className={classes.fullWidthCenter}>
                        <Container className="default-empty-alert-container">
                            <Typography color="primary"
                                gutterBottom={true}
                                variant="subtitle1">
                                {NoDevicesInfoMessage}
                            </Typography>
                            <Button 
                                onClick={() => addDevice()}
                                variant="outlined"
                                focusRipple={false}
                                style={{
                                    marginBottom: 15,
                                    marginTop: 15,
                                    paddingRight:"5px"
                                }} >
                                <AddOutlinedIcon color="primary" /> {AddDeviceButtonLabel}
                            </Button>
                        </Container>
                    </div>
                </div>
            </div>
        )
    }

 }

 export default connect(mapStateToProps)(Devices)