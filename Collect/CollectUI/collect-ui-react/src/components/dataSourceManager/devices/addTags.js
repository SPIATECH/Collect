//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import { setData, setToastData } from '../../../redux'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { connect, useDispatch } from 'react-redux'
import Header from '../../header/Header'
import serialize  from 'form-serialize'
import './Devices.scss'
import {getDeviceTypeById, selectDeviceType, getDevices, addTagList, getTagList, getTagType } from '../../../redux'
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import { 
    SaveButtonLabel,
    BackButtonLabel,
    FirstLevelGroupParentId,
    UnGroupName,
    CollectUnGroupId,
    ToastMessageTypes,
    TagNameMaxLength,
    TagNameMaxLengthErrorMessage,
    TagNameRegX,
    TagNameErrorMessage,
    TagExistsErrorMessage,
} from '../../../common/GlobalConstants';

const mapStateToProps = store => {
    return {
        SelectedDeviceTypeBucket: store.devicetype.SelectedDeviceTypeBucket,
        selectedDeviceBucket: store.devices.selectedDeviceBucket,
        TagTypeBucket: store.tagList.TagTypeBucket,
        TagListBucket: store.tagList.TagListBucket
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


class addTags extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            values: [],
            formPropersties:'',
            tagName: '',
            deviceTypeDisplayName: '',
            deviceTypeName: '',
            deviceTypeId: '',
            deviceName: '',
            deviceId: '',
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
                this.setState({deviceTypeId:paramItems['device']})
                this.setState({deviceId:paramItems['edit']})

                this.props.dispatch(getDeviceTypeById(paramItems['device']))
                this.props.dispatch(getTagType(paramItems['device']))
                this.props.dispatch(getTagList(paramItems['edit']))
            } 
        }     
    }

    handleTagSubmit = (e) => {
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
            var form = document.querySelector('#tag-form');
            var obj = serialize(form, { hash: true });
            var tagName = obj.tagName
            var tagTypeId = this.props.TagTypeBucket[0].id
            delete obj.tagName
            let tagData = {
                "version": "1",
                "name": tagName,
                "type": "string",
                "enabled": true,
                "tagGroupId": CollectUnGroupId,
                "tagTypeId": tagTypeId,
                "deviceId": this.state.deviceId,
                "parentFullName": UnGroupName,
                "additionalProp1": {}
            }
            let formData = Object.assign(obj, tagData)
            console.log(formData);
            console.log('--------formData--------');
            this.props.dispatch(addTagList(formData))
            window.location = window.location.origin+"/#/datasources/devices/tags?device="+this.state.deviceTypeId+"&edit="+this.state.deviceId
        }
        
        e.preventDefault();
    }

    closeAddForm = (e) => {
        window.location = window.location.origin+"/#/datasources/devices/tags?device="+this.state.deviceTypeId+"&edit="+this.state.deviceId
        e.preventDefault();
    }

    handleInputValueChange = (validationSets, e) => {
        console.log(validationSets)
        console.log('validationSets')
       
        const inputValue = e.target.value
        this.setState({ values: { ...this.state.values, [e.target.name]: inputValue } })
        if(validationSets !== false){
            var validationSet = validationSets[0];
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
                this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: 'Invalid input'} })
                
            }
            else {
                console.log("Success: form validated !!!")
                this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: false } })
                this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: '' } })
            } 
        }
        
    }

    handleCheckboxValueChange = (e) => {
        const value = e.target.checked
        this.setState({ values: { ...this.state.values, [e.target.name]: value } })
    }

    handleTagNameChange = (e) =>{
        const value = e.target.value
        this.setState({tagName:value})
        console.log(this.props.TagListBucket)
        console.log('this.props.TagListBucket')

        if (this.props.TagListBucket) {
            this.state.isError = this.props.TagListBucket.some(tags => {
                return tags.name === value
            })
        }

        if(this.state.isError){
            console.log("Error: name already exist !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: TagExistsErrorMessage } })
        }
        else if (value.length > TagNameMaxLength) {
            console.log("Error: Maxlength exceeded !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: TagNameMaxLengthErrorMessage } })
        }
        else if (!TagNameRegX.test(value)) {
            console.log("Error: Invalid !!"+value)
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: true } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: TagNameErrorMessage } })
            
        }
        else {
            console.log("Success: form validated !!!")
            this.setState({ isInvalid: { ...this.state.isInvalid, [e.target.name]: false } })
            this.setState({ errorMessage: { ...this.state.errorMessage, [e.target.name]: '' } })
        }

    }

    formInputsTag(formElements) {
        const { classes } = this.props;
        if(formElements.type == "string"){
            return(
                <FormControl className="full-width" className={classes.root}>
                    <TextField 
                        onChange={(e) => this.handleInputValueChange(formElements.hasOwnProperty('validations') ? formElements.validations : false, e)}
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
                        onChange={(e) => this.handleInputValueChange(formElements.hasOwnProperty('validations') ? formElements.validations : false, e)}
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
                    <InputLabel id={formElements.name}>{formElements.displayname}</InputLabel>
                    <Select  
                        onChange={(e) => this.handleInputValueChange(formElements.hasOwnProperty('validations') ? formElements.validations : false, e)}
                        helpertext={this.state.errorMessage[formElements.name] !== undefined ? this.state.errorMessage[formElements.name] : ''}
                        error={this.state.isInvalid[formElements.name] !== undefined ? this.state.isInvalid[formElements.name] : false}
                        autoWidth={true}
                        id={formElements.name}
                        labelId={formElements.name}
                        name={formElements.name}
                        value={this.state.values[formElements.name] !== undefined ? this.state.values[formElements.name] : formElements.default}
                        size="small">
                        { Object.entries(formElements.options).map((x,y) => <MenuItem key={y} value={x[1]}>{x[1]}</MenuItem>) } 
                    </Select>
                </FormControl>
            )
        }
        else if(formElements.type == "checkbox"){
            return(
                <FormControl variant="outlined" className="full-width" className={classes.root}>
                   <FormControlLabel
                        control={
                        <Checkbox
                            defaultChecked={!formElements.default ? "":"checked"}
                            checked={this.state.values[formElements.name] !== undefined ? this.state.values[formElements.name] : formElements.default}
                            onChange={this.handleCheckboxValueChange}
                            name={formElements.name}
                            color="primary"
                        />
                        }
                        label={formElements.displayname}
                    />
                    <input 
                        type="hidden" 
                        name={formElements.name}
                        value={this.state.values[formElements.name] !== undefined ? this.state.values[formElements.name] : formElements.default}
                    />
                </FormControl>
            )
        }
    }

    formRender = (e) => {
        if(this.props.TagTypeBucket.length > 0 ){
            
            this.state.formPropersties = this.props.TagTypeBucket.map(e => e.properties)
            console.log(this.state.formPropersties);
            return (
                this.state.formPropersties[0].map((key, val) => {
                    return <Grid item xs={4}  key={key.name}>
                      {this.formInputsTag(key) }
                    </Grid>
                })
            )
        }else{
            return "Something wrong"
        }
    }

    render() {
        
        console.log(this.state);
        console.log('this.state');
        const { classes  } = this.props;
        if(this.props.TagTypeBucket.length > 0 ){
            return (
                <div  style={{height:"100%"}}>
                    <Header title={this.props.title}  description={this.props.description}/>
                    <div className="tabContentarea">
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <form id="tag-form"  method="patch" onSubmit={this.handleTagSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}  key='initialk'>
                                            <FormControl className="full-width" className={classes.root}>
                                                <TextField onChange={this.handleTagNameChange}
                                                    helperText={this.state.errorMessage['tagName'] !== undefined ? this.state.errorMessage['tagName'] : ''}
                                                    error={this.state.isInvalid['tagName'] !== undefined ? this.state.isInvalid['tagName'] : false}
                                                    id='tagName'
                                                    label='Tag Name'
                                                    name='tagName'
                                                    size="small"
                                                    required={true}
                                                    value={this.state.tagName}
                                                    variant="outlined" />
                                            </FormControl>
                                        </Grid>
                                        {this.formRender()}
                                        <Grid item xs={12}>
                                            <div className="alert-modal-btns text-right">
                                                <Button autoFocus color="primary" variant="outlined" type="button" onClick={this.handleTagSubmit}><AddOutlinedIcon />  {SaveButtonLabel} </Button>
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
        }else{
            return "";
        }
    }
}
export default connect(mapStateToProps)(withStyles(formStyle)(addTags))