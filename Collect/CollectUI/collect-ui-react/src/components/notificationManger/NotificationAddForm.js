//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import { connect } from 'react-redux'
import { setData, setToastData } from '../../redux'
import { Container, Row, Col, Tab, Form, Nav } from 'react-bootstrap';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { 
    NotificationNameId, 
    NotificationEmailId, 
    NotificationPhoneId, 
    NotificationEmailSubjectId, 
    NotificationEmailMessageId, 
    NotificationSmsMessageId, 
    NotificationInputValidatorID, 
    NotificationExistsErrorMessage, 
    NotificationFormSubmitError, 
    NotificationEmailSMSCommonError,  
    SMSDefaultMessage, 
    EmailDefaultSubject, 
    EmailDefaultMessage, 
    RecoveryAlertLabel, 
    NotificaionNameLabel, 
    NotificationEmailLabel, 
    NotificationSubjectLabel, 
    NotificationEmailMessageLabel, 
    NotificationPhoneLabel, 
    NotificationSMSMessageLabel, 
    SaveButtonLabel, 
    BackButtonLabel, 
    SendEmailButtonLabel, 
    SendSMSButtonLabel, 
    ToastMessageTypes,
    NotificationNameMaxLength,
    NotificationEmailMaxLength,
    NotificationPhoneMaxLength,
    NotificationEmailMessageMaxLength,
    NotificationEmailSubjectMaxLength,
    NotificationSMSMessageMaxLength,
    MaxInputCharacterAddition
} from '../../common/GlobalConstants'
import validator from '../../common/InputValidations'

const mapStateToProps = store => {
    return {
        SingleNotificationBucket: store.notifications.SelectedNotificationBucket,
        NotificationBucket: store.notifications.NotificationBucket,
        TagBucket: store.notifications.TagBucket,
        selectedNotificationTag: store.notifications.selectedNotificationTag,
        selectedNotificationTagname: store.notifications.selectedNotificationTagname,
        selectedNotificationAlertid: store.notifications.selectedNotificationAlertid,
        selectedNotificationAlertname: store.notifications.selectedNotificationAlertname,
        isEdit: store.notifications.isEdit,
    }
}

class NotificationView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            emailAddress: '',
            notificationName: '',
            emailSubject: EmailDefaultSubject,
            emailMessage: EmailDefaultMessage,
            phoneNumber: '',
            smsMessage: SMSDefaultMessage,
            editVal: '',
            recoveryAlert: false,
            enabled: true,
            fields: {},
            errors: {},
            isError:false,
            errorMessage:'',
            notificationNameAlreadyExist: false,
            tabMailSwitch: false,
            tabSMSSwitch: false
        }
        this.handleEmailChanged = this.handleEmailChanged.bind(this);
        this.handleEmailSubjChanged = this.handleEmailSubjChanged.bind(this);
        this.handleEmailMessageChanged = this.handleEmailMessageChanged.bind(this);
        this.handlePhNumberChanged = this.handlePhNumberChanged.bind(this);
        this.handleSMSMessageChanged = this.handleSMSMessageChanged.bind(this);
        this.handleRecoveryAlertChanged = this.handleRecoveryAlertChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMailFormValid = this.handleMailFormValid.bind(this);
        this.handleSMSFormValid = this.handleSMSFormValid.bind(this);
        
    }

    handleEmailChanged(event) {
        this.setState({ emailAddress: event.target.value })
        this.handleMailFormValid()
    }

    handleEmailSubjChanged(event) {
        this.handleMailFormValid()
        this.setState({ emailSubject: event.target.value })
        
    }

    handleEmailMessageChanged(event) {
        this.handleMailFormValid()
        this.setState({ emailMessage: event.target.value })
        
    }

    handlePhNumberChanged(event) {
        this.setState({ phoneNumber: event.target.value })
    }

    handleSMSMessageChanged(event) {
        this.setState({ smsMessage: event.target.value })
    }

    handleRecoveryAlertChanged(event) {
        this.setState({ recoveryAlert: event.target.checked })
    }

    handleMailFormValid(){
        if(this.state.emailAddress !=="" ){
           
            if(this.state.emailSubject ==="" || this.state.emailMessage ===""){
                this.setState({tabMailSwitch: true})
            }else{
                this.setState({tabMailSwitch: false})
            }
        }else{
            this.setState({tabMailSwitch: false})
        }
        
    }

    
    handleSMSFormValid(){
        if(this.state.phoneNumber !=="" ){
            if(this.state.smsMessage ===""){
                this.setState({tabSMSSwitch: true})
            }else{
                this.setState({tabSMSSwitch: false})
            }
        }else{
            this.setState({tabSMSSwitch: false})
        }
        
    }


    handleSubmit = (e) => {
        e.preventDefault();


        var hasError = false
        var hasMailError = false
        var hasSMSError = false
        var formIsValid = false;
        let errors = {};

        hasError = validator.validate(NotificationNameId, e.target[NotificationNameId].value,  NotificationInputValidatorID).isInvalid || validator.validate(NotificationEmailId, e.target[NotificationEmailId].value, NotificationInputValidatorID).isInvalid ||   validator.validate(NotificationEmailSubjectId, e.target[NotificationEmailSubjectId].value, NotificationInputValidatorID).isInvalid ||  validator.validate(NotificationEmailMessageId, e.target[NotificationEmailMessageId].value, NotificationInputValidatorID).isInvalid || validator.validate(NotificationPhoneId, e.target[NotificationPhoneId].value, NotificationInputValidatorID).isInvalid || validator.validate(NotificationSmsMessageId, e.target[NotificationSmsMessageId].value, NotificationInputValidatorID).isInvalid

        hasMailError =  validator.validate(NotificationEmailId, e.target[NotificationEmailId].value, NotificationInputValidatorID).isInvalid ||   validator.validate(NotificationEmailSubjectId, e.target[NotificationEmailSubjectId].value, NotificationInputValidatorID).isInvalid ||  validator.validate(NotificationEmailMessageId, e.target[NotificationEmailMessageId].value, NotificationInputValidatorID).isInvalid

        hasSMSError =  validator.validate(NotificationPhoneId, e.target[NotificationPhoneId].value, NotificationInputValidatorID).isInvalid || validator.validate(NotificationSmsMessageId, e.target[NotificationSmsMessageId].value, NotificationInputValidatorID).isInvalid

        if(hasMailError){
            this.setState({tabMailSwitch: true})
        }
        
        if(hasSMSError){
            this.setState({tabSMSSwitch: true})
        }
        

        console.log("Notification form has error: ", hasError)

        if (this.state.notificationNameAlreadyExist) {
            this.props.dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: NotificationExistsErrorMessage
            }))
            console.log("Error: Notification name already exists!!!")
        }
        else if (hasError) {
            formIsValid = false
            this.props.dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: NotificationFormSubmitError
            }))
            console.log(NotificationFormSubmitError)
        }
        else {
            if (this.state.emailAddress == "" && this.state.phoneNumber == "") {
                formIsValid = false
                this.props.dispatch(setToastData({
                    type: ToastMessageTypes.error,
                    message: NotificationEmailSMSCommonError
                }))
                console.log(NotificationEmailSMSCommonError)
            }
            else {


                formIsValid = true
                const notification = {
                    "name": this.state.notificationName=="" ? this.props.selectedNotificationTagname+'_'+this.props.selectedNotificationAlertname : this.state.notificationName,
                    "enabled": this.state.enabled,
                    "email": {
                        "to": this.state.emailAddress,
                        "subject": this.state.emailSubject,
                        "message": this.state.emailMessage
                    },
                    "sms": {
                        "to": this.state.phoneNumber,
                        "message": this.state.smsMessage
                    },
                    "alertId": this.props.selectedNotificationAlertid == null ? this.props.SingleNotificationBucket[0].alertId : this.props.selectedNotificationAlertid,
                    "recoveryalert":this.state.recoveryAlert
                }
                e.preventDefault();
                this.props.onSubmit(notification, this.state.editVal);
                console.log(notification);
            }
        }
        this.setState({ errors: errors });
    }
   
    handleDialogBack = (event, props) => {
        this.props.onClick(true)
    }

    
    handleInputValueChange = (e) => {
        const value = e.target.value
        if (e.target.id === "notificationname") {
            this.setState({ notificationName: e.target.value })
            // Check if name already exist
            if (this.props.NotificationBucket) {
                
                this.state.isError = this.props.NotificationBucket.some(notification => {
                    return notification.name === value
                })
            }
            if (this.state.isError) {
                this.setState({ notificationNameAlreadyExist: true })
                this.setState({ errorMessage: NotificationExistsErrorMessage })
            }
            else {
                this.setState({ notificationNameAlreadyExist: false })
                this.setState({ errorMessage: "" })
            }
            
        }

        if (e.target.id !== undefined) {
            console.log(e.target.id)
            this.setState({ [e.target.id]: value })
           // this.setState({ notification: { ...this.state.notification, [e.target.id]: value } })
        }
        else if (e.target.name !== undefined) {
            console.log(e.target.name)
            this.setState({ [e.target.name]: value })
        }
    }
    
    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}  method="patch">
                <Tab.Container id="left-tabs-example" defaultActiveKey="alert_tab">
                    <Container>
                    <Row>
                        <Col sm={9}>
                            <FormControl className="full-width mt-20">
                                <TextField onChange={this.handleInputValueChange}
                                    helperText={this.state.errorMessage || validator.validate(NotificationNameId, this.state.notificationName, NotificationInputValidatorID).errorMessage}
                                    error={this.state.isError || validator.validate(NotificationNameId, this.state.notificationName, NotificationInputValidatorID).isInvalid}
                                    id={NotificationNameId}
                                    label={NotificaionNameLabel}
                                    name="notificationName"
                                    size="small"
                                    required={true}
                                    variant="outlined"
                                    inputProps={{ maxLength: NotificationNameMaxLength + MaxInputCharacterAddition }}
                                    value={this.state.notificationName } />
                            </FormControl>
                            <div className="config-area">
                                <Tab.Content className="notifi-tab">
                                    <Tab.Pane eventKey="alert_tab">
                                        <FormControl className="full-width">
                                            <TextField onChange={this.handleEmailChanged}
                                                onFocus={this.handleMailFormValid}
                                                onKeyUp={this.handleMailFormValid}
                                                helperText={validator.validate(NotificationEmailId, this.state.emailAddress, NotificationInputValidatorID).errorMessage}
                                                error={validator.validate(NotificationEmailId, this.state.emailAddress, NotificationInputValidatorID).isInvalid}
                                                id={NotificationEmailId}
                                                label={NotificationEmailLabel}
                                                name="emailAddress"
                                                multiline
                                                rows="2"
                                                size="small"
                                                variant="outlined"
                                                inputProps={{ maxLength: NotificationEmailMaxLength + MaxInputCharacterAddition }}
                                                value={this.state.emailAddress} />
                                        </FormControl>

                                        <FormControl className="full-width">
                                            <TextField onChange={this.handleEmailSubjChanged}
                                                onFocus={this.handleMailFormValid}
                                                onKeyUp={this.handleMailFormValid}
                                                helperText={validator.validate(NotificationEmailSubjectId, this.state.emailSubject, NotificationInputValidatorID).errorMessage}
                                                error={validator.validate(NotificationEmailSubjectId, this.state.emailSubject, NotificationInputValidatorID).isInvalid}
                                                id={NotificationEmailSubjectId}
                                                label={NotificationSubjectLabel}
                                                name="emailSubject"
                                                size="small"
                                                required={this.state.emailAddress !="" ? true : false}
                                                variant="outlined"
                                                inputProps={{ maxLength: NotificationEmailSubjectMaxLength + MaxInputCharacterAddition }}
                                                value={this.state.emailSubject} />
                                        </FormControl>

                                        <FormControl className="full-width area-mheight-126">
                                            <TextField onChange={this.handleEmailMessageChanged}
                                                onFocus={this.handleMailFormValid}
                                                onKeyUp={this.handleMailFormValid}
                                                helperText={validator.validate(NotificationEmailMessageId, this.state.emailMessage, NotificationInputValidatorID).errorMessage}
                                                error={validator.validate(NotificationEmailMessageId, this.state.emailMessage, NotificationInputValidatorID).isInvalid}
                                                id={NotificationEmailMessageId}
                                                label={NotificationEmailMessageLabel}
                                                name="emailMessage"
                                                multiline
                                                rows="2"
                                                size="small"
                                                required={this.state.emailAddress !="" ? true : false}
                                                variant="outlined"
                                                inputProps={{ maxLength: NotificationEmailMessageMaxLength + MaxInputCharacterAddition }}
                                                value={this.state.emailMessage} />
                                        </FormControl>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="notify_tab" className="m-height-312">
                                        <FormControl className="full-width">
                                            <TextField onChange={this.handlePhNumberChanged}
                                                onFocus={this.handleSMSFormValid}
                                                onKeyUp={this.handleSMSFormValid}
                                                helperText={validator.validate(NotificationPhoneId, this.state.phoneNumber, NotificationInputValidatorID).errorMessage}
                                                error={validator.validate(NotificationPhoneId, this.state.phoneNumber, NotificationInputValidatorID).isInvalid}
                                                id={NotificationPhoneId}
                                                label={NotificationPhoneLabel}
                                                name="phoneNumber"
                                                multiline
                                                rows="3"
                                                size="small"
                                                variant="outlined"
                                                inputProps={{ maxLength: NotificationPhoneMaxLength + MaxInputCharacterAddition }}
                                                value={this.state.phoneNumber} />
                                        </FormControl>

                                        <FormControl className="full-width">
                                            <TextField onChange={this.handleSMSMessageChanged}
                                                onFocus={this.handleSMSFormValid}
                                                onKeyUp={this.handleSMSFormValid}
                                                helperText={validator.validate(NotificationSmsMessageId, this.state.smsMessage, NotificationInputValidatorID).errorMessage}
                                                error={validator.validate(NotificationSmsMessageId, this.state.smsMessage, NotificationInputValidatorID).isInvalid}
                                                id={NotificationSmsMessageId}
                                                label={NotificationSMSMessageLabel}
                                                name="smsMessage"
                                                multiline
                                                rows="3"
                                                size="small"
                                                required={this.state.phoneNumber !="" ? true : false}
                                                variant="outlined"
                                                inputProps={{ maxLength: NotificationSMSMessageMaxLength + MaxInputCharacterAddition }}
                                                value={this.state.smsMessage} />
                                        </FormControl>
                                        
                                        <Form.Group controlId="exampleForm.ControlInput2">
                                            <Form.Control type="hidden" value={this.state.editVal} />
                                        </Form.Group>

                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Col>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column alert-tab">
                                <Nav.Item className={this.state.tabMailSwitch ? "validateSection":""}>
                                    <Nav.Link eventKey="alert_tab"><i><MailOutlineOutlinedIcon /></i> {SendEmailButtonLabel}</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className={this.state.tabSMSSwitch ? "validateSection":""}>
                                    <Nav.Link eventKey="notify_tab"><i><SmsOutlinedIcon /></i> {SendSMSButtonLabel}</Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Divider />
                            <FormControlLabel className="recovery-alert-label"
                                control={
                                <Checkbox
                                    checked={this.state.recoveryAlert}
                                    onChange={this.handleRecoveryAlertChanged}
                                    value="recoveryAlert"
                                    color="primary"
                                />
                                }
                                label={RecoveryAlertLabel}
                            />

                            
                            <span className="form-error">{this.state.errors["comon_valid"]}</span>
                        </Col>
                        
                        <Col sm={12} className="common-btns">
                            <FormControl className="previeos-btn" >
                                <Button aria-label="back" variant="outlined" color="primary" type="button" onClick={this.handleDialogBack}><ArrowBackIosIcon /> {BackButtonLabel}</Button>
                            </FormControl>
                            <FormControl  className="save-btn">
                                <Button autoFocus color="primary" variant="outlined" color="primary" type="submit"><AddOutlinedIcon />  {SaveButtonLabel} </Button>
                            </FormControl>
                        </Col>
                    </Row>
                    </Container>
                </Tab.Container>
            </form>
        )
    }
}
export default connect(mapStateToProps)(NotificationView)
