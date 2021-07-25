//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImportDialog from '@material-ui/core/Dialog';
import ImportContent  from '@material-ui/core/DialogContent';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AutorenewIcon from '@material-ui/icons/Autorenew'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { connect, useDispatch } from 'react-redux';
import { setData, setToastData } from '../../redux'
import fileDownload from 'react-file-download'
import { 
    commitAlerts, 
    getExport,  
    importAlerts, 
    importNotification, 
    deleteAllAlertNotification, 
    getAllTempAlertNotification, 
    importConfig, 
    getExportConfig 
} from '../../redux'

import { 
    ImportFileExtension, 
    ExportLinkLabel, 
    ImportLinkLabel, 
    CommitLinkLabel, 
    ImportProgressPopupLabel, 
    ImportProgressPopupRollbackLabel, 
    ToastMessageTypes, 
    ImportAlertEmptyAlert, 
    ImportDeleteAlerts, 
    ImportFileExtensionError, 
    ImportFileContentError, 
    ImportAlertFailed, 
    ImportNotificationFailed, 
    ImportConfigFailed, 
    ImportSuccess, 
    ImportRollback, 
    ImportFailedAction, 
    ExportProgressPopupLabel, 
    ExportSuccess, 
    ExportFailed,
    RefreshDisableDuration
} from '../../common/GlobalConstants'

const mapStateToProps = store => {
    return {
        alertInfo: store.alertInfo,
        TempDeletingBucket: store.importstore.TempDeletingBucket,
        ExportConfigBucket: store.exportstore.exportConfigBucket
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      textAlign:'center',
      minWidth:500,
      '& > * + *': {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(6),
      },
    },
  }));

function Import(props){
    const [impDialogOpen, setImpDialogOpen] = React.useState(false);
    const [impDialogMsg, setImpDialogMsg] = React.useState(false);
    const [disableRefresh, setDisableRefresh] = React.useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    var recallStatus = useState(false);
    var ImpStat = useState(false);
    var importStatus = useState(false);
    var exportStatus = useState(false);
    let promiseResolution = ''
    var file_json_content = ''
    var metaData = ''
    var fileNameTime = ''
    var tempDate = new Date()
    var timezoneShort = (tempDate.toString().match(/\(([A-Za-z\s].*)\)/)[1]).match(/\b\w/g).join('');
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var getDate = ((tempDate.getDate()).toString()).padStart(2, '0')+'-'+((tempDate.getMonth() + 1).toString()).padStart(2, '0')+'-'+tempDate.getFullYear()+' '+((tempDate.getHours()).toString()).padStart(2, '0')+':'+((tempDate.getMinutes()).toString()).padStart(2, '0')+':'+((tempDate.getSeconds()).toString()).padStart(2, '0') +' '+ timezoneShort

    var userBrowser = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i), browser;
    if (navigator.userAgent.match(/Edg/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
        browser = "IE";
    }else {
        browser = userBrowser[1].toLowerCase();
    }

    if (props.alertInfo && props.alertInfo.info) {
        metaData = '"meta":{"Version":"'+ props.alertInfo.info.version +'","Username":"'+ props.alertInfo.info.user +'","Date":"'+ getDate +'","TimeZone":"'+ timezone +'","Machine Name":"'+ props.alertInfo.info.hostname +'","Browser Name":"'+ browser +'"}'
        fileNameTime = props.alertInfo.info.version+'-'+((tempDate.getDate()).toString()).padStart(2, '0')+((tempDate.getMonth() + 1).toString()).padStart(2, '0')+tempDate.getFullYear()+'-'+((tempDate.getHours()).toString()).padStart(2, '0')+((tempDate.getMinutes()).toString()).padStart(2, '0')+((tempDate.getSeconds()).toString()).padStart(2, '0')
    }
    else {
        metaData = '"meta":{"Version":" ","Username":" ","Date":"'+ getDate +'","TimeZone":"'+ timezone +'","Machine Name":" ","Browser Name":"'+ browser +'"}'
        fileNameTime = ((tempDate.getDate()).toString()).padStart(2, '0')+((tempDate.getMonth() + 1).toString()).padStart(2, '0')+tempDate.getFullYear()+'-'+((tempDate.getHours()).toString()).padStart(2, '0')+((tempDate.getMinutes()).toString()).padStart(2, '0')+((tempDate.getSeconds()).toString()).padStart(2, '0')
    }

    const globalCommit = () => {
        console.log("committing .. ..")
        dispatch(commitAlerts());
        //Disable refresh for 5sec to avoid multi click
        setDisableRefresh(true)
        setTimeout( function() { 
            setDisableRefresh(false)
        } .bind(this), RefreshDisableDuration );
    }

    const globalExport = async () => {
        console.log("exporting .. ..")
        setImpDialogMsg(ExportProgressPopupLabel)
        setImpDialogOpen(true)
        exportStatus = await gexportDatas()

        if(exportStatus.status == false){
            props.dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: exportStatus.message
            }))
            setTimeout( function() { setImpDialogOpen(false) } .bind(this), 2000 );
        }else{
           
            setTimeout( function() { setImpDialogOpen(false) } .bind(this), 2000 );
            setTimeout( function() { 
                props.dispatch(setToastData({
                    type: ToastMessageTypes.success,
                    message: exportStatus.message
                }))
            } .bind(this), 2200 );
            if(exportStatus.alertContent !== '' && exportStatus.configContent !== ''){
                file_json_content= '{'+ metaData +',"alert":' + JSON.stringify(exportStatus.alertContent) + ',"config": ' + JSON.stringify(exportStatus.configContent) + ' }'
            }else if(exportStatus.alertContent !== '' && exportStatus.configContent === ''){
                file_json_content= '{'+ metaData +',"alert":' + JSON.stringify(exportStatus.alertContent) + '}'
            }else if(exportStatus.alertContent === '' && exportStatus.configContent !== ''){
                file_json_content= '{'+ metaData +',"config":' + JSON.stringify(exportStatus.configContent) + '}'
            }else{
                file_json_content= '{'+ metaData +'}'
            }
            
            fileDownload(file_json_content, 'Alertinfo-'+ fileNameTime +'.'+ ImportFileExtension);
            
        }
    }

    function gexportDatas(){
        return new Promise(function(resolve, reject) {
            try{
                dispatch(getExport()).then(function (res) {
                    console.log(res)
                    if(res.response.status == 200 || res.response.status == 204){
                        dispatch(getExportConfig()).then(function (resp) {
                            console.log(res)
                            if(resp.response.status == 200 || resp.response.status == 204){
                                promiseResolution = {
                                    status : true,
                                    message : ExportSuccess,
                                    alertContent: res.response.data,
                                    configContent: resp.response.data
                                };
                                resolve(promiseResolution)
                            }else{
                                promiseResolution = {
                                    status : true,
                                    message : ExportFailed,
                                    alertContent: res.response.data,
                                    configContent: ''
                                };
                                resolve(promiseResolution)
                            }
                        })
                    }else{
                        dispatch(getExportConfig()).then(function (resp) {
                            console.log(res)
                            if(resp.response.status == 200 || resp.response.status == 204){
                                promiseResolution = {
                                    status : true,
                                    message : ExportSuccess,
                                    alertContent: '',
                                    configContent: resp.response.data
                                };
                                resolve(promiseResolution)
                            }else{
                                promiseResolution = {
                                    status : false,
                                    message : ExportFailed,
                                    alertContent: '',
                                    configContent: ''
                                };
                                resolve(promiseResolution)
                            }
                        })
                    }
                })
            }
            catch (error) {
                promiseResolution = {
                    status : false,
                    message : ExportFailed,
                    alertContent: '',
                    configContent: ''
                };
                resolve(promiseResolution)
            }
        })
        
    }

    function rollbackImport(readAlert, readConfig){
        return new Promise(function(resolve, reject) {
            try{
				
                dispatch(deleteAllAlertNotification()).then(function (resp) {
                    if(resp.response.status == 200 || resp.response.status == 204){

                        if(readConfig.length === 0){
                            console.log("No config info exist")
                            if(readAlert.length === 0){
                                console.log('no alert exist, clearing all exising alerts')
                                promiseResolution = {
                                    status : true,
                                    type : true,
                                    message : ImportSuccess,
                                    recall: false
                                };
                                resolve(promiseResolution)
                            }else{
                                ImpStat = InsertAlertData(readAlert)
                                resolve(ImpStat)
                            }
                        }else{
                            InsertConfigData(readConfig).then(data => {
                                if(data.status===true){
                                    if(readAlert.length === 0){
                                        console.log('no alert exist, clearing all exising alerts')
                                        promiseResolution = {
                                            status : true,
                                            type : true,
                                            message : ImportSuccess,
                                            recall: false
                                        };
                                        resolve(promiseResolution)
                                    }else{
                                        ImpStat = InsertAlertData(readAlert)
                                        resolve(ImpStat)
                                    }
                                }else{
                                    promiseResolution = {
                                        status : false,
                                        type : false,
                                        message : ImportConfigFailed,
                                        recall: true
                                    };
                                    resolve(promiseResolution)
                                }
                            })
                        }
                    }else{
                        console.log('---------failed-------')
                        promiseResolution = {
                            status : false,
                            type : false,
                            message : ImportDeleteAlerts,
                            recall: true
                        };
                        resolve(promiseResolution)
                    }
                })
            }catch(e){
                console.log("Invalid JSON format :", e)
                promiseResolution = {
                    status : false,
                    type : false,
                    message : ImportFileContentError,
                    recall: false
                };
                resolve(promiseResolution)
            }
        })
    }

    const globalImport = (event) => {
        document.getElementById("selectFile").click()
        dispatch(getAllTempAlertNotification())
        dispatch(getExportConfig())
    }

    const fileSelectHandler = async (event) =>{
        event.preventDefault();
        var file = event.target.files[0];
        setImpDialogMsg(ImportProgressPopupLabel)
        setImpDialogOpen(true)
        importStatus = await checkFileValidity(file)
        
        if(importStatus.status == false){
            document.getElementById("selectFile").value = "";
            props.dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: importStatus.message
            }))

            if(importStatus.recall){
                setImpDialogMsg(ImportProgressPopupRollbackLabel)
               
                recallStatus = await rollbackImport(props.TempDeletingBucket, props.ExportConfigBucket)
                
                if(recallStatus.status == false){
                    setTimeout( function() {
                        setImpDialogOpen(false)
                        props.dispatch(setToastData({
                            type: ToastMessageTypes.error,
                            message: importStatus.message
                        }))
                     } .bind(this), 2000 );
                }else{
                    setTimeout( function() { 
                        setImpDialogOpen(false) 
                        props.dispatch(setToastData({
                            type: ToastMessageTypes.success,
                            message: ImportRollback
                        }))
						window.location.reload();
                    } .bind(this), 2000 );
                }

            }else{
                setTimeout( function() { setImpDialogOpen(false) } .bind(this), 2000 );
            }
           
            
        }else{
            document.getElementById("selectFile").value = "";
           
            setTimeout( function() { 
                setImpDialogOpen(false)
                props.dispatch(setToastData({
                    type: ToastMessageTypes.success,
                    message: importStatus.message
                }))
				window.location.reload();
             } .bind(this), 2000 );
        }
    }

    function checkFileValidity(file){
        return new Promise(function(resolve, reject) {
            try{
                if(file.name != ""){
                    var extension = file.name.split('.').pop();
                    if(extension == ImportFileExtension){
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            try{
                                dispatch(deleteAllAlertNotification()).then(function (resp) {
                                    if(resp.response.status == 200 || resp.response.status == 204){
                                        var readobj = JSON.parse(event.target.result);
										
										if(typeof readobj['config'] === 'undefined' || typeof readobj['alert'] === 'undefined'){
											promiseResolution = {
												status : false,
												type : true,
												message : ImportFileContentError,
												recall: true
											};
											resolve(promiseResolution)
										}else{
										
											if(readobj['config'].length === 0){
												console.log("No config info exist")
												if(readobj['alert'].length === 0){
													console.log('no alert exist, clearing all exising alerts')
													promiseResolution = {
														status : true,
														type : true,
														message : ImportSuccess,
														recall: false
													};
													resolve(promiseResolution)
												}else{
													ImpStat = InsertAlertData(readobj['alert'])
													resolve(ImpStat)
												}
											}else{
												InsertConfigData(readobj['config']).then(data => {
													if(data.status===true){
														if(readobj['alert'].length === 0){
															console.log('no alert exist, clearing all exising alerts')
															promiseResolution = {
																status : true,
																type : true,
																message : ImportSuccess,
																recall: false
															};
															resolve(promiseResolution)
														}else{
															ImpStat = InsertAlertData(readobj['alert'])
															resolve(ImpStat)
														}
													}else{
														promiseResolution = {
															status : false,
															type : false,
															message : ImportConfigFailed,
															recall: true
														};
														resolve(promiseResolution)
													}
												})
											}
										}
                                    }else{
                                        console.log('---------failed-------')
                                        promiseResolution = {
                                            status : false,
                                            type : false,
                                            message : ImportDeleteAlerts,
                                            recall: true
                                        };
                                        resolve(promiseResolution)
                                    }
                                })
                            }catch(e){
                                console.log("Invalid JSON format :", e)
                                promiseResolution = {
                                    status : false,
                                    type : false,
                                    message : ImportFileContentError,
                                    recall: false
                                };
                                resolve(promiseResolution)
                            }
                        };
                        reader.readAsText(file);
                        
                    }else{
                        promiseResolution = {
                            status : false,
                            type : false,
                            message : ImportFileExtensionError,
                            recall: true
                        };
                        resolve(promiseResolution)
                    }
                }
            }
            catch (error) {
                promiseResolution = {
                    status : false,
                    type : false,
                    message : ImportFailedAction,
                    recall: true
                };
                resolve(promiseResolution)
            }
        })
    }

    function InsertAlertData(alertdata){
        return new Promise(function(resolve, reject) {
            try {
                console.log(alertdata.length)
                console.log('alert length')
                var p = 0
                alertdata.forEach((key, val) => {
                    if(key.enabled === undefined || key.name === undefined || key.tagId === undefined || key.type === undefined || key.user === undefined || key.deadbandvalue === undefined || key.activationDelay === undefined || key.unit === undefined || key.FQTagName === undefined || key.function === undefined || key.alertinfo === undefined || key.alertinfo.condition === undefined || key.alertinfo.value === undefined || key.alertinfo.interval === undefined || key.alertinfo.unit === undefined){
                       console.log('field not exist');
                       promiseResolution = {
                            status : false,
                            type : false,
                            message : ImportFileContentError,
                            recall: true
                        };
                        resolve(promiseResolution)
                    }
                    const impAlert = {
                        "enabled": key.enabled,
                        "name": key.name,
                        "tagId": key.tagId,
                        "type": key.type,
                        "user": key.user,
                        "deadbandvalue": key.deadbandvalue,
                        "activationDelay": key.activationDelay,
                        "unit": key.unit,
                        "FQTagName": key.FQTagName,
                        "function": key.function,
                        "metadata": key.metadata,
                        "context": key.context,
                        "alertinfo": {
                            "condition": key.alertinfo.condition,
                            "value": key.alertinfo.value,
                            "interval": key.alertinfo.interval,
                            "unit": key.alertinfo.unit
                        }
        
                    }
                    dispatch(importAlerts(impAlert)).then(function (alert_res) {
                        console.log(alert_res.response.status)
                        if(alert_res.response.status == 200 && alert_res.response.data.id != ""){
                           
                            if(key.notifications === undefined){
                                p++
                                if(p === alertdata.length){
                                    promiseResolution = {
                                        status : true,
                                        type : true,
                                        message : ImportSuccess,
                                        recall: false
                                    };
                                    resolve(promiseResolution)
                                }
                            }else{
                                
                                key.notifications.forEach((keys, vals) => {

                                    if(keys.name === undefined|| keys.enabled === undefined || keys.email === undefined || keys.email.to === undefined || keys.email.subject === undefined || keys.email.message === undefined || keys.sms === undefined || keys.sms.to === undefined || keys.sms.message === undefined || keys.recoveryalert === undefined){
                                        promiseResolution = {
                                            status : false,
                                            type : false,
                                            message : ImportFileContentError,
                                            recall: true
                                        };
                                        resolve(promiseResolution)
                                    }

                                    const impNotification = {
                                        "name": keys.name,
                                        "enabled": keys.enabled,
                                        "email": {
                                            "to": keys.email.to,
                                            "subject": keys.email.subject,
                                            "message": keys.email.message
                                        },
                                        "sms": {
                                            "to": keys.sms.to,
                                            "message": keys.sms.message
                                        },
                                        "alertId": alert_res.response.data.id,
                                        "recoveryalert":keys.recoveryalert
                                    }
        
                                    dispatch(importNotification(impNotification)).then(function (not_res) {
                                        if(not_res.response.status == 200){
                                            p++
                                            if(p === alertdata.length){
                                                console.log('not_res.response 1')
                                                promiseResolution = {
                                                    status : true,
                                                    type : true,
                                                    message : ImportSuccess,
                                                    recall: false
                                                };
                                                resolve(promiseResolution)
                                            }
                                        }else{
                                            console.log('Import notification failed')
                                            promiseResolution = {
                                                status : false,
                                                type : false,
                                                message : ImportNotificationFailed,
                                                recall: true
                                            };
                                            resolve(promiseResolution)
                                        }
                                    })
                                })
                            }
                        }else{
                            console.log('---------Import Alert failed----------')
                            promiseResolution = {
                                status : false,
                                type : false,
                                message : ImportAlertFailed,
                                recall: true
                            };
                            resolve(promiseResolution)
                        }
                    })
                    
                })
            }
            catch (error) {
                promiseResolution = {
                    status : false,
                    type : false,
                    message : ImportFailedAction,
                    recall: true
                };
                resolve(promiseResolution)
            }
        })
    }

    function InsertConfigData(configdata){
        return new Promise(function(resolve, reject) {
            try {
                var k = 0
                configdata.forEach((result) => {
                    dispatch(importConfig(result)).then(function (config_res) {
                        console.log(config_res)
                        if(config_res.response.status == 200 || config_res.response.status == 204){
                            if(k === configdata.length){
                                promiseResolution = {
                                    status : true
                                };
                                resolve(promiseResolution)
                            }
                        }else{
                            console.log('Import config failed')
                            promiseResolution = {
                                status : false
                            };
                            resolve(promiseResolution)
                        }
                    })
                    k++
                })
            }catch (error) {
                promiseResolution = {
                    status : false
                };
                resolve(promiseResolution)
            }
        })
    }

   
    return(
        <div className="settings-menu">
            <ul className="nav">
                <li className="nav-item rotate-180" onClick={globalExport}>
                    <ExitToAppIcon /><span className="linkTitle">{ExportLinkLabel}</span>
                </li>
                <li className="nav-item" onClick={() => globalImport()}>
                    <input type='file' id='selectFile' accept={"."+ImportFileExtension} onChange={fileSelectHandler} style={{ display: 'none' }} />
                    <ExitToAppIcon /><span className="linkTitle">{ImportLinkLabel}</span>
                </li>
                <li className={disableRefresh ? "nav-item disabled":"nav-item"} onClick={globalCommit}>
                    <AutorenewIcon /><span className="linkTitle">{CommitLinkLabel}</span>
                </li>
            </ul>
            <ImportDialog 
                className="alert-select-modal" 
                aria-labelledby='customized-dialog-title' 
                maxWidth='md' 
                open={impDialogOpen} 
                size='medium' >
                <ImportContent>
                    <div className={classes.root}>
                        <Typography variant="h6" gutterBottom>
                            {impDialogMsg}
                        </Typography>
                        <LinearProgress />
                    </div>
                </ImportContent>
            </ImportDialog>
        </div>
    )
}

export default connect(mapStateToProps)(Import)