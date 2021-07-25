//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { useState } from 'react'
import Header from '../header/Header';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogContent from '@material-ui/core/DialogContent'
import Checkbox from '@material-ui/core/Checkbox';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import Button from '@material-ui/core/Button';
import { Container, Row, Col } from 'react-bootstrap';
import Tooltip from '@material-ui/core/Tooltip';
import { connect, useDispatch } from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { 
  setToastData, 
  selectNotification, 
  getNotificationById, 
  deleteNotification, 
  updateNotification, 
  selectNotificationAlert,
  selectNotificationAlertID, 
  getAllAlerts, 
  filterNotification 
} from '../../redux'

import { 
  NotificationPageDefaultHeading, 
  AddNotificationButtonLabel, 
  DeleteNotificationWarningMessage, 
  DeleteNotificationWarningHeading, 
  EnableLabel, 
  DeleteLabel, 
  EmailLabel, 
  SmsLabel, 
  SearchLabel, 
  ToastMessageTypes, 
  NotificationsMaxLimitReachedError, 
  NotificationNotFoundMessage, 
  NotificationListPageCount, 
  NoButtonLabel, 
  YesButtonLabel, 
  EscKeyCode 
} from '../../common/GlobalConstants'
import './Notification.scss';

const alertDisplayCardStyle = makeStyles(theme => ({
  card: {
      width: '100%',
      marginBottom: '5px'
  },
  valueCondition: {
      fontSize: 24,
  },
  title: {
      fontSize: 30,
  },
  valueConditionContainer: {
      display: 'flex',
      flexFlow: 'row',
      padding: '5px 0 0 0',
      alignItems: 'center'
  },
  condition: {
      margin: '0 5px 0 5px',
      fontSize: 25
  },
  action: {
      display: 'flex',
      justifyContent: 'right'
  }
}))

const mapStateToProps = store => {
  return {
      NotificationBucket: store.notifications.NotificationBucket,
      SingleNotificationBucket: store.notifications.SelectedNotificationBucket,
      FilterNotificationBucket: store.notifications.FilterNotificationBucket,
      TagAlertsBucket: store.notifications.TagAlertsBucket,
      selectedNotificationAlert: store.notifications.selectedNotificationAlert,
      notificationInfo: store.alertInfo
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


function NotificationManager(props) {
  const dispatch = useDispatch();
  const [isShow, isConfirm] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState(1);
  const [pagePosition, setPagePosition] = useState([0, NotificationListPageCount]);
  const [notiDeleteID, setnotiDeleteID] = useState('');
  const cardClasses = alertDisplayCardStyle()
  const [notiList, setNotiList] = React.useState([]);
  const [pageList, setpageList] = React.useState([]);
  var pageCount = 0;
  var lastCount = 0;
  var notificationDatas = useState(false);
  var filterResult = [];
  const classes = styles();

  function handleCloseModal(e){
    if (e.keyCode == EscKeyCode) {
        console.log("esc key pressed")
        isConfirm(false)
        dispatch(selectNotificationAlertID(''));
    }
  }

  const handleClickOpen = () => {
        if (props.NotificationBucket.length >= props.notificationInfo.info.config.notificationmax) {
            dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: NotificationsMaxLimitReachedError
            }))
        }
        else {
            dispatch(getAllAlerts());
            window.location = window.location.origin+"/#/notifications/AddNotification";
        }
  };

  function deleteFile(){
    dispatch(deleteNotification(notiDeleteID))
    isConfirm(false);
  }

  function onCancel(){
    isConfirm(false);
    dispatch(selectNotificationAlert())
  }

  function handleSearch(event){
    dispatch(filterNotification(filterResult))
    notiList.length = 0;
    let searchValue = event.target.value.toLowerCase();
    if(searchValue !=""){
      console.log('-----------Search Value------------');
      console.log(searchValue);
      const notificationList = props.NotificationBucket;
     
        for(var i = 0, len = notificationList.length; i < len; i++){
          var notifName = notificationList[i].name.toLowerCase();
          if(notifName.indexOf(searchValue) !== -1){
            notiList.push(notificationList[i]);
          }
        }

        if(notiList.length == 0){
          notiList.push(NotificationNotFoundMessage)
        }
    }
    

  }

  function handlePageChange(event, value){
    console.log("value:" + value)
      if(value > 1){
        setSelectedPage(value)
        if(props.NotificationBucket.length > (NotificationListPageCount * value)){
          lastCount = parseInt((NotificationListPageCount * value))
          setPagePosition([lastCount - NotificationListPageCount, lastCount])
          console.log("Start Pos :" + (lastCount - NotificationListPageCount))
          console.log("End Pos :" + lastCount)
        }else{
          lastCount = parseInt((props.NotificationBucket.length))
          var previousPagePos = parseInt(value) - 1;  
          //To calculate the start position  by multiplying previous page count * number of items in a page
          var startValue = NotificationListPageCount * previousPagePos;
          setPagePosition([startValue, lastCount])
          console.log("Start Pos :" + startValue)
          console.log("End Pos :" + lastCount)
        }
        
      }else{
        setSelectedPage(1)
        setPagePosition([0, NotificationListPageCount])
      }
      
  }

  function handleEnableChange(event){
    console.log(event.target.checked)
    console.log(event.target.value)
    const selectEnableID = event.target.value;
    console.log(props.NotificationBucket)

    const selecteEnabledNoti = Array.isArray(props.NotificationBucket) && props.NotificationBucket.find(el => el.id ==selectEnableID);

    const enableNotification = {
        "name": selecteEnabledNoti.name,
        "enabled": event.target.checked,
        "email": {
            "to": selecteEnabledNoti.email.to,
            "subject": selecteEnabledNoti.email.subject,
            "message": selecteEnabledNoti.email.message
        },
        "sms": {
            "to": selecteEnabledNoti.sms.to,
            "message": selecteEnabledNoti.sms.message
        },
        "alertId": selecteEnabledNoti.alertId,
        "recoveryalert":selecteEnabledNoti.recoveryalert
    }
    console.log(enableNotification)

    dispatch(updateNotification(selectEnableID, enableNotification))
  }

  function confirmDeleteAction() {
    return(
      <Dialog 
        className="alert-select-modal" 
        aria-labelledby='customized-dialog-title' 
        open={isShow} 
        maxWidth='md'
        onKeyDown={handleCloseModal} 
        size='medium'>
        <DialogContent>
          <Container>
            <Row className="show-grid">
              <Col xs={12} md={12}>
                <div className="delepopContent">
                  <span><DeleteOutlineOutlinedIcon /></span>
                  <h6>{DeleteNotificationWarningHeading}</h6>
                  <p>{DeleteNotificationWarningMessage}</p>
                </div>
              </Col>
                <Col xs={12} md={12}>
                  <div className="popdele-btns text-center">
                  <Button onClick={onCancel} color="primary" variant="outlined" color="primary" type="submit">  {NoButtonLabel} </Button>
                  <Button onClick={deleteFile} color="primary" variant="outlined" color="primary" type="submit">  {YesButtonLabel} </Button>
                  </div>
                </Col>
            </Row>
          </Container>
        </DialogContent>
      </Dialog>
    )
  }

  function editNotification(notificationId, alertId) {
    dispatch(getAllAlerts());
    dispatch(selectNotification(notificationId));
    dispatch(getNotificationById(notificationId, false));
    window.location = window.location.origin+"/#/notifications/EditNotification?notification="+notificationId;
  }

  function deleteSingleNotification(notificationId) {
    isConfirm(true);
    setnotiDeleteID(notificationId)
  }

  const DialogContent = withStyles(theme => ({}))(MuiDialogContent)

  if(notiList.length == 0){
    pageCount = Math.ceil(props.NotificationBucket.length/NotificationListPageCount);
  }else{
    pageCount = Math.ceil(notiList.length/NotificationListPageCount);
  }

  function renderNotification(props){
    if(notiList[0] == NotificationNotFoundMessage){
        return (
          <Typography className="no-filter-found" color="primary" gutterBottom={true} variant="subtitle1"> {NotificationNotFoundMessage} </Typography>
        )
        
    }else{
        pageList.length = 0;
        
        if(notiList.length == 0){
          //notificationDatas = props.NotificationBucket;
          if(pageCount > 1){
            for(var j = pagePosition[0]; j < pagePosition[1]; j++){
              if(j in props.NotificationBucket){
                pageList.push(props.NotificationBucket[j]);
              }
            }
            notificationDatas = pageList;
          }else{
            notificationDatas = props.NotificationBucket;
          }

        }else{
          //notificationDatas = notiList;
          if(pageCount > 1){
            for(var m = pagePosition[0]; m < pagePosition[1]; m++){
              pageList.push(notiList[m]);
            }
            notificationDatas = pageList;
          }else{
            notificationDatas = notiList;
          }
        }

        return (
          notificationDatas.map((key, val) => {
              return <Card className={cardClasses.card}  variant="outlined" key={key.id}>
                <CardContent style={{padding: 0}}>
                  <div className="alert-content-box">
                      <div className="alert-enable-box">
                        <Tooltip title={EnableLabel} placement="top" arrow>
                          <FormControlLabel control={ <Checkbox value={key.id} color="primary" onChange={handleEnableChange} defaultChecked={key.enabled} /> } /></Tooltip>
                      </div>
                      <div className="alert-info-box notifications-card-list">
                          <span className="alert-name" onClick={() => editNotification(key.id, key.alertId)}>{key.name}</span>
                          <span className="alert-icon">
                            {(key.email.to) !== "" && <Tooltip title={EmailLabel} placement="top" arrow><MailOutlineOutlinedIcon /></Tooltip>}
                            {(key.sms.to) !== "" && <Tooltip title={SmsLabel} placement="top" arrow><SmsOutlinedIcon /></Tooltip>}
                          </span>
                      </div>
                      <div className="alert-action-box">
                          <Tooltip title={DeleteLabel} placement="top" arrow><span><DeleteOutlineOutlinedIcon onClick={() => deleteSingleNotification(key.id)} /></span></Tooltip>
                      </div>
                  </div>
              </CardContent>
          </Card>
          })
        )
    }
  }

  function notifiListData(props){
    return (
      <div className="tabContentarea">
        <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div>
                {confirmDeleteAction()}
              </div>
              <section className="notif-filters">
                <div className="add-common-btn"style={{ marginBottom: 10 }} >
                    <Button 
                      variant="outlined" 
                      onClick={handleClickOpen} 
                      focusRipple={false}
                      style={{ marginBottom: 15, marginTop: 15 }} >
                        <AddOutlinedIcon color="primary" /> {AddNotificationButtonLabel}
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
              <div className="min-height-div">
                {renderNotification(props)}
              </div>
              
              <div className="notification-pagination">
                <Pagination count={pageCount}  page={selectedPage} variant="outlined" shape="rounded"  onChange={handlePageChange}/>
              </div>
            </Paper>
        </Grid>
      </div>
    )
  }

  if (props.NotificationBucket.length > 0) {
    return (
      <div className="content-sec" style={{height:"100%"}}>
          <Header title={props.title}  description={props.description} />
          {notifiListData(props)}
      </div>
    )
  } else {
    return (
      <div>
        <Header title={props.title} description={props.description} />
       
        <div className="tabContentarea">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Row className="justify-content-md-center">
                  <Col xs lg="2"></Col>
                  <Col md="auto" style={{ textAlign: 'center' }}>
                    <Typography color="primary" gutterBottom={true} variant="subtitle1"> {NotificationPageDefaultHeading} </Typography>
                    <Button 
                      variant="outlined" 
                      focusRipple={false}  
                      onClick={handleClickOpen}> 
                      <AddOutlinedIcon color="primary" /> 
                    </Button>
                  </Col>
                  <Col xs lg="2"></Col>
                </Row>
            </Paper>
          </Grid>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps)(NotificationManager)