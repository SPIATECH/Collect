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
import { shouldAskForConfirmation, setToastData,getTagsByTagId, getTagGroupByTagId, addTagAlert} from '../../redux'
import { AlertFunctionListDefault, AlertConditionListDefault, AlertUnitListDefault , AlertFunctionDefaultUnit,  AlertExistsErrorMessage, ToastMessageTypes } from '../../common/GlobalConstants'
import { NameId, ValueId, DeadbandvalueId, ActivationDelayId, IntervalId, AlertFormSubmitError, AlertInputValidatorID } from '../../common/GlobalConstants'
import validator from '../../common/InputValidations'

const mapStateToProps = store => {
    return {
        askForConfirmation: store.validation.askForConfirmation,
        currentTagAlerts: store.alerts.CollectTagAlerts,
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

class addAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: {
                name: this.props.data == null ? '' : this.props.data.alertName,
                value: this.props.data == null ? '' : this.props.data.alertValue,
                condition: this.props.data == null ? AlertConditionListDefault : this.props.data.alertCondition,
                enabled: this.props.data == null ? true : this.props.data.alertEnable,
                deadbandvalue: this.props.data == null ? '' : this.props.data.alertDeadband,
                activationDelay: this.props.data == null ? '' : this.props.data.alertActivationDelay,
                FQTagname:  this.props.data == null ? '' : this.props.data.alertFQTagname,
                function: this.props.data == null ? AlertFunctionListDefault : this.props.data.alertFunction,
                interval: this.props.data == null ? '' : this.props.data.alertInterval,
                unit: this.props.data == null ? AlertUnitListDefault : this.props.data.alertUnit,
                infounit: this.props.data == null ? AlertFunctionDefaultUnit : this.props.data.alertInfoUnit,
                id: this.props.data == null ? '' : this.props.data.alertId
            },
            alertNameAlreadyExist: false,
            alertExistErrorMessage: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleInputValueChange = (e) => {

        const value = e.target.value
        var isError = false
        //For checking duplicate alert name
        if (e.target.id === "name") {

            // Check if name already exist
            isError = this.props.currentTagAlerts.some(alert => {
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

    componentDidMount() {
        console.log('alerts dialog opened')
        var queryString = window.location.href;
        var hash =  queryString.split('?');
        var paramItems = {}
        if(hash.length > 1){
            hash[1].split('&').map(hk => { 
            let temp = hk.split('='); 
            paramItems[temp[0]] = temp[1] 
            });

            if (paramItems['tags']) {
                this.props.dispatch(getTagsByTagId(paramItems['tags']));
                this.props.dispatch(getTagGroupByTagId(paramItems['tags']));
            } 
        }  
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
           
            if (alertData.function === AlertFunctionListDefault) {
                functionValue = AlertFunctionListDefault;
                unitValue = "";
                intervalValue = "";
            }else if(alertData.function !== AlertFunctionListDefault && unitValue ===""){
                unitValue = AlertFunctionDefaultUnit;
            }

            if(alertData.condition === "="){
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
            console.log(alert)
            this.props.dispatch(addTagAlert(alert))
            window.location = window.location.origin+"/#/groups/tags/alerts?tags="+this.props.SelectedTag
        }

    }

    render() {
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
                                    isFunSelected={this.state.alert.function !== AlertFunctionListDefault ? 'inline-flex' : 'none'}

                                    isFun={this.state.alert.function !== AlertFunctionListDefault ? true : false}

                                    isError={this.state.alertNameAlreadyExist}
                                    errorMessage={this.state.alertExistErrorMessage}

                                    alertName={this.state.alert.name}
                                    alertValue={this.state.alert.value}
                                    alertCondition={this.state.alert.condition}
                                    alertEnable={this.state.alert.enabled}
                                    alertDeadband={this.state.alert.deadbandvalue}
                                    alertActivationDelay={this.state.alert.activationDelay}
                                    alertFQTagname={this.state.alert.FQTagName}
                                    alertFunction={this.state.alert.function}
                                    alertInterval={this.state.alert.interval}
                                    alertUnit={this.state.alert.unit}
                                    alertInfoUnit={this.state.alert.infounit}

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

export default connect(mapStateToProps)(withStyles(formStyle)(addAlert))