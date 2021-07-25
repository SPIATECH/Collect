//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Header from '../header/Header'
import AlertItem from './AlertItem'
import { connect } from 'react-redux'
import { shouldAskForConfirmation, setToastData, updateAlert} from '../../redux'
import { AlertFunctionListDefault, AlertFunctionDefaultUnit,  AlertExistsErrorMessage, ToastMessageTypes } from '../../common/GlobalConstants'
import { NameId, ValueId, DeadbandvalueId, ActivationDelayId, IntervalId, AlertFormSubmitError, AlertInputValidatorID } from '../../common/GlobalConstants'
import validator from '../../common/InputValidations'
import { FormatListBulletedRounded } from '@material-ui/icons';

const mapStateToProps = store => {
    return {
        currentTagAlerts: store.alerts.selectedAlertBucket,
        askForConfirmation: store.validation.askForConfirmation,
        CollectAlerts: store.alerts.CollectTagAlerts,
        SelectedTag: store.tags.selectedTag,
        selectFQTagname: store.tags.selectFQTagname,
    }
}

const formStyle = theme => {
    return ({
        root: {
            flexGrow: 1,
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
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'left',
            color: theme.palette.text.secondary,
        }
    });
};

class editAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: [],
            previous_name: "",
            alertNameAlreadyExist: false,
            alertExistErrorMessage: "",
        }
        
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    componentDidUpdate(){

        if(this.props.currentTagAlerts.length > 0){
            if(!('name' in this.state.alert)){
                this.setState({ alert: { ...this.state.alert, ['name']: this.props.currentTagAlerts[0].name } })
            }

            if(!('previous_name' in this.state.alert)){
                this.setState({ alert: { ...this.state.alert, ['previous_name']: this.props.currentTagAlerts[0].name } })
            }

            if(!('FQTagname' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['FQTagname']: this.props.currentTagAlerts[0].FQTagName } })
            }

             if(!('activationDelay' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['activationDelay']: this.props.currentTagAlerts[0].activationDelay } })
            }

            if(!('condition' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['condition']: this.props.currentTagAlerts[0].alertinfo.condition } })
            } 

            if(!('interval' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['interval']: this.props.currentTagAlerts[0].alertinfo.interval } })
            }

            if(!('infounit' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['infounit']: this.props.currentTagAlerts[0].alertinfo.unit } })
            }

            if(!('value' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['value']: this.props.currentTagAlerts[0].alertinfo.value } })
            }

            if(!('deadbandvalue' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['deadbandvalue']: this.props.currentTagAlerts[0].deadbandvalue } })
            }

            if(!('enabled' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['enabled']: this.props.currentTagAlerts[0].enabled } })
            }

            if(!('function' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['function']: this.props.currentTagAlerts[0].function } })
            }

            if(!('unit' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['unit']: this.props.currentTagAlerts[0].unit } })
            }

            if(!('id' in this.state.alert)){ 
                this.setState({ alert: { ...this.state.alert, ['id']: this.props.currentTagAlerts[0].id } })
            }
        }
    }

    handleInputValueChange = (e) => {

        const value = e.target.value
        var isError = FormatListBulletedRounded
        if (e.target.id === "name") {
            console.log(value)
            if(this.state.alert.previous_name !== value){
                isError = this.props.CollectAlerts.some(alert => {
                    return alert.name === value
                })

                if (isError) {
                    this.setState({ alertNameAlreadyExist: true })
                    this.setState({ alertExistErrorMessage: AlertExistsErrorMessage })
                }
                else {
                    this.setState({ alertNameAlreadyExist: false })
                    this.setState({ alertExistErrorMessage: "" })
                }
            }
        }

        if (e.target.id !== undefined) {
            console.log(e.target.id)
            this.setState({ alert: { ...this.state.alert, [e.target.id]: value } })
        }
        else if (e.target.name !== undefined) {
            console.log(e.target.name)
            this.setState({ alert: { ...this.state.alert, [e.target.name]: value } })
        }
        this.props.dispatch(shouldAskForConfirmation(true))
    }

    componentWillUnmount() {
        console.log('alerts dialog closed')
        this.props.dispatch(shouldAskForConfirmation(false))
    }

    handleSubmit = (e) => {
        e.preventDefault();

        var hasError = false


        hasError = validator.validate(NameId, e.target[NameId].value, AlertInputValidatorID).isInvalid ||
            validator.validate(ValueId, e.target[ValueId].value, AlertInputValidatorID).isInvalid ||
            validator.validate(DeadbandvalueId, e.target[DeadbandvalueId].value, AlertInputValidatorID).isInvalid ||
            validator.validate(ActivationDelayId, e.target[ActivationDelayId].value, AlertInputValidatorID).isInvalid ||
            validator.validate(IntervalId, e.target[IntervalId].value, AlertInputValidatorID).isInvalid 

        console.log("Alert form has error: ", hasError)

        if (this.state.alertNameAlreadyExist) {
            console.log("Error: Alert name already exists!!!")
        }
        else if (hasError) {
            console.log(AlertFormSubmitError)
            this.props.dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: AlertFormSubmitError
            }))
        }
        else {
            const alertData = this.state.alert;
            
            let functionValue = alertData.function
            let intervalValue = alertData.interval
            let unitValue = alertData.infounit
            let deadband = alertData.deadbandvalue
           
            if (alertData.function == AlertFunctionListDefault) {
                functionValue = AlertFunctionListDefault;
                unitValue = "";
                intervalValue = "";
            }else if(alertData.function !== AlertFunctionListDefault && unitValue ==""){
                unitValue = AlertFunctionDefaultUnit;
            }

            if(alertData.condition == "="){
                deadband = "";
            }

            const alert = {
                "enabled": alertData.enabled,
                "name": alertData.name,
                "tagId": this.props.SelectedTag,
                "type": "string",
                "user": "string",
                "deadbandvalue": deadband,
                "activationDelay": alertData.activationDelay,
                "unit": alertData.unit,
                "FQTagName": this.props.selectFQTagname,
                "function": functionValue,
                "metadata": {},
                "context": "string",
                "alertinfo": {
                    "condition": alertData.condition,
                    "value": alertData.value,
                    "interval": intervalValue,
                    "unit": unitValue
                }
            }
            alert.id = alertData.id
            console.log(alert)
            this.props.dispatch(updateAlert(alert))
            window.location = window.location.origin+"/#/groups/tags/alerts?tags="+this.props.SelectedTag
        }

    }

    render() {
        console.log(this.state.alert.function)
        console.log('this.state.alert.function')
        const { classes  } = this.props;
        return (
            <div style={{height:"100%"}}>
                <Header title={this.props.title}  description={this.props.description}/>
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <form id="alert-form" onSubmit={this.handleSubmit}>
                                <AlertItem disabled={false}
                                    isForm={true}
                                    isFunSelected={this.state.alert.function !== undefined && this.state.alert.function != AlertFunctionListDefault ? 'inline-flex' : 'none'}

                                    isFun={this.state.alert.function !== undefined && this.state.alert.function != AlertFunctionListDefault ? true : false}

                                    isError={this.state.alertNameAlreadyExist}
                                    errorMessage={this.state.alertExistErrorMessage}

                                    alertName={this.state.alert.name !== undefined ? this.state.alert.name : ''}
                                    alertValue={this.state.alert.name !== undefined ? this.state.alert.value : ''}
                                    alertCondition={this.state.alert.name !== undefined ? this.state.alert.condition : ''}
                                    alertEnable={this.state.alert.name !== undefined ? this.state.alert.enabled : ''}
                                    alertDeadband={this.state.alert.name !== undefined ? this.state.alert.deadbandvalue : ''}
                                    alertActivationDelay={this.state.alert.name !== undefined ? this.state.alert.activationDelay : ''}
                                    alertFQTagname={this.state.alert.name !== undefined ? this.state.alert.FQTagName : ''}
                                    alertFunction={this.state.alert.name !== undefined ? this.state.alert.function : ''}
                                    alertInterval={this.state.alert.name !== undefined ? this.state.alert.interval : ''}
                                    alertUnit={this.state.alert.name !== undefined ? this.state.alert.unit : ''}
                                    alertInfoUnit={this.state.alert.name !== undefined ? this.state.alert.infounit : ''}
                                    handleInputValueChange={this.handleInputValueChange}
                                    handleSubmit={this.handleSubmit} />
                            </form>
                        </Paper>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(withStyles(formStyle)(editAlert))