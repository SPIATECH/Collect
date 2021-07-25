//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import { setToastData } from '../../../redux'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { connect } from 'react-redux'
import Header from '../../header/Header'
import serialize  from 'form-serialize'
import './Devices.scss'
import {getDeviceTypeById, addDevice, getDeviceByDeviceId, updateDevice, removeSelectedDevice } from '../../../redux'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { 
    SaveButtonLabel,
    BackButtonLabel,
    ToastMessageTypes,
    DeviceNameMaxLength,
    DeviceNameMaxLengthErrorMessage,
    DeviceNameRegX,
    DeviceNameErrorMessage,
    DeviceExistsErrorMessage,
} from '../../../common/GlobalConstants';

const mapStateToProps = store => {
    return {
        SelectedDeviceTypeBucket: store.devicetype.SelectedDeviceTypeBucket,
        selectedDeviceBucket: store.devices.selectedDeviceBucket,
        selectedDevice: store.devices.selectedDevice,
        DevicesBucket: store.devices.DevicesBucket,
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


class editDevices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            values: [],
            formPropersties:'',
            deviceName: '',
            deviceOldName: '',
            deviceTypeDisplayName: '',
            deviceTypeName: '',
            deviceTypeId: '',
            errorMessage: [],
            isInvalid: [],
            isError:false,
        }
    }
    
    componentDidMount() {
        var queryString = window.location.href;
        var hash =  queryString.split('?');
        var paramItems = {}
        if(hash.length > 1){
            hash[1].split('&').map(hk => { 
            let temp = hk.split('='); 
            paramItems[temp[0]] = temp[1] 
            });

            if (paramItems['device'] && paramItems['edit']) {
                this.props.dispatch(removeSelectedDevice())
                this.setState({deviceTypeId:paramItems['device']})
                this.setState({deviceName:''})
                this.setState({deviceOldName:''})
                this.props.dispatch(getDeviceTypeById(paramItems['device']))
                this.props.dispatch(getDeviceByDeviceId(paramItems['edit']))
            }
        }
        
       
    }

    handleSubmit = (e) => {
        var hasError = false
        var invalidArrray = this.state.isInvalid;

        Object.keys(invalidArrray).forEach(function(key) {
           if(invalidArrray[key] === true && !hasError){
                hasError = true
           }
        });

        if(hasError){
            console.log("Error: Form inputs invalid !!!")
            this.props.dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: "Invalid Inputs"
            }))
        }else{
            var form = document.querySelector('#device-form');
            var deviceData = serialize(form, { hash: true });
            var devicename = deviceData.devicename
            var deviceTypeId = this.props.SelectedDeviceTypeBucket[0].id
            var deviceId = this.props.selectedDeviceBucket[0].id
            delete deviceData.devicename
            
            let deviceObj = {
                "version": "1",
                "name": devicename,
                "type": "string",
                "enabled": true,
                "deviceTypeId": deviceTypeId,
                "additionalProp1": {}
            }
            let formData = Object.assign(deviceData, deviceObj)

            if(deviceId !== "" && deviceId !== false){
                this.props.dispatch(updateDevice(deviceId, formData))
            }

            window.location = "/#/datasources/devices?device="+this.state.deviceTypeId
        }
        e.preventDefault();
    }

    closeAddForm = (e) => {
        window.location = "/#/datasources/devices?device="+this.state.deviceTypeId
        e.preventDefault();
    }

    handleInputValueChange = (validationSets, e) => {
        var validationSet = validationSets[0];
        const inputValue = e.target.value
        this.setState({ values: { ...this.state.values, [e.target.name]: inputValue } })
        
        var validRegex = new RegExp(validationSet.validRegex);

        if (inputValue.length > validationSet.maxLength) {
            console.log("Error: Maxlength exceeded !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: 'Maxlength exceeded' } })
        }
        else if (parseInt(inputValue) < validationSet.minValue || parseInt(inputValue) > validationSet.maxValue) {
            console.log("Error: max and min value required !!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: 'Must be greater or less than '+validationSet.minValue +' and '+ validationSet.maxValue} })
        }
        else if (inputValue.length < validationSet.minLength) {
            console.log("Error: Minimum Characters required !!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: 'Minimum length required '+validationSet.minLength } })
        }
        else if (!validRegex.test(inputValue)) {
            console.log("Error: Invalid !!"+inputValue)
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: 'Invalid input' } })
            
        }
        else {
            console.log("Success: form validated !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: false } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: '' } })
        } 
    }

    handleDeviceNameChange = (e) =>{
        const value = e.target.value
        this.setState({deviceName:value})
        
        if(this.state.deviceOldName !== value){
            if (this.props.DevicesBucket) {
                this.state.isError = this.props.DevicesBucket.some(device => {
                    return device.name === value
                })
            }
        }
        
        if(this.state.isError){
            console.log("Error: name already exist !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: DeviceExistsErrorMessage } })
        }
        else if (value.length > DeviceNameMaxLength) {
            console.log("Error: Maxlength exceeded !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: DeviceNameMaxLengthErrorMessage } })
        }
        else if (!DeviceNameRegX.test(value)) {
            console.log("Error: Invalid !!"+value)
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: DeviceNameErrorMessage } })
            
        }
        else {
            console.log("Success: form validated !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: false } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: '' } })
        } 
    }

    handleSetStateValues(fieldName){
        console.log(this.props.selectedDeviceBucket);
        console.log('this.props.selectedDeviceBucket');
        if(this.props.selectedDeviceBucket.length > 0){
            var formProps = this.props.selectedDeviceBucket[0]
            if (fieldName in formProps) {
                var formvalue = formProps[fieldName]
                //console.log(fieldName+ ": " +formvalue);
                //console.log('formvalue');
                if(fieldName in this.state.values){
                    console.log('exist')
                }else{
                    this.setState({ values: { ...this.state.values, [fieldName]: formvalue } })
                }
            }
            if(this.state.deviceName === "" && this.state.deviceOldName === ""){
                if("name" in formProps){
                    this.setState({deviceName:formProps["name"]})
                    this.setState({deviceOldName:formProps["name"]})
                }
            }
        }
    }

    formInputsTag(formElements) {
        const { classes } = this.props;
        if(formElements.type == "string"){
            return(
                <FormControl className="full-width" className={classes.root}>
                    <TextField
                        onChange={(e) => this.handleInputValueChange(formElements.validations, e)}
                        helperText={this.state.errorMessage[formElements.name] !== undefined ? this.state.errorMessage[formElements.name] : ''}
                        error={this.state.isInvalid[formElements.name] !== undefined ? this.state.isInvalid[formElements.name] : false}
                        id={formElements.name}
                        label={formElements.displayname}
                        name={formElements.name}
                        size="small"
                        required={formElements.required}
                        value={this.state.values[formElements.name] !== undefined ? this.state.values[formElements.name] : formElements.default}
                        variant="outlined" />
                </FormControl>
            )
        }
        else if(formElements.type == "number"){
            return(
                <FormControl className="full-width" className={classes.root}>
                    <TextField
                        onChange={(e) => this.handleInputValueChange(formElements.validations, e)}
                        helperText={this.state.errorMessage[formElements.name] !== undefined ? this.state.errorMessage[formElements.name] : ''}
                        error={this.state.isInvalid[formElements.name] !== undefined ? this.state.isInvalid[formElements.name] : false}
                        id={formElements.name}
                        label={formElements.displayname}
                        name={formElements.name}
                        size="small"
                        type="number"
                        required={formElements.required}
                        value={this.state.values[formElements.name] !== undefined ? this.state.values[formElements.name] : formElements.default}
                        variant="outlined" />
                </FormControl>
            )
        }
        else if(formElements.type == "enum"){
            return(
                <FormControl variant="outlined" className="full-width" className={classes.root}>
                    <InputLabel id="select-unit">{formElements.displayname}</InputLabel>
                    <Select
                        onChange={(e) => this.handleInputValueChange(formElements.validations, e)}
                        helperText={this.state.errorMessage[formElements.name] !== undefined ? this.state.errorMessage[formElements.name] : ''}
                        error={this.state.isInvalid[formElements.name] !== undefined ? this.state.isInvalid[formElements.name] : false}
                        autoWidth={true}
                        id={formElements.name}
                        labelId={formElements.name}
                        required={formElements.required}
                        name={formElements.name}
                        value={this.state.values[formElements.name] !== undefined ? this.state.values[formElements.name] : formElements.default}
                        size="small">
                        { Object.entries(formElements.options).map((x,y) => <MenuItem key={y} value={x[1]}>{x[1]}</MenuItem>) } 
                    </Select>
                </FormControl>
            )
        }
    }

    formRender = (e) => {
        if(this.props.SelectedDeviceTypeBucket.length > 0 ){
            
            this.state.formPropersties = this.props.SelectedDeviceTypeBucket.map(e => e.properties)
            console.log(this.state.formPropersties);
            return (
                this.state.formPropersties[0].map((key, val) => {
                    return <Grid item xs={4}  key={key.name}>
                      {this.formInputsTag(key) }
                      {this.handleSetStateValues(key.name)}
                    </Grid>
                })
            )
        }else{
            return "Something wrong"
        }
    }

    render() {
        

        const { classes  } = this.props;
        return (
            <div  style={{height:"100%"}}>
                <Header title={this.props.title}  description={this.props.description}/>
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <form id="device-form"  method="patch" onSubmit={this.handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={4}  key='initialk'>
                                        <FormControl className="full-width" className={classes.root}>
                                            <TextField onChange={this.handleDeviceNameChange}
                                                helperText={this.state.errorMessage['devicename'] !== undefined ? this.state.errorMessage['devicename'] : ''}
                                                error={this.state.isInvalid['devicename'] !== undefined ? this.state.isInvalid['devicename'] : false}
                                                id='devicename'
                                                label='Device Name'
                                                name='devicename'
                                                size="small"
                                                required={true}
                                                value={this.state.deviceName}
                                                variant="outlined" />
                                        </FormControl>
                                    </Grid>
                                    {this.formRender()}
                                    <Grid item xs={12}>
                                        <div className="alert-modal-btns text-right">
                                            <Button autoFocus color="primary" variant="outlined" type="submit"><AddOutlinedIcon />  {SaveButtonLabel} </Button>
                                            <Button aria-label="back" variant="outlined" color="primary" type="button" onClick={this.closeAddForm}><ArrowBackIosIcon /> {BackButtonLabel}</Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps)(withStyles(formStyle)(editDevices))