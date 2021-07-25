//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import InputLabel from '@material-ui/core/InputLabel'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'

import { Container, Row, Col } from 'react-bootstrap';
import { deleteAlert, updateAlert } from '../../redux'
import { useDispatch } from 'react-redux'
import { 
    AlertFunctionList, 
    AlertFunctionListDefault, 
    AlertConditionList, 
    AlertConditionListDefault, 
    AlertUnitList, 
    AlertUnitListDefault,
    AlertFunctionDefaultUnit,
    AlertNameInputLabel, 
    AlertConditionInputLabel, 
    AlertValueInputLabel, 
    AlertDeadbandInputLabel,
    AlertActivationDelayInputLabel, 
    AlertUnitInputLabel,
    AlertFunctionInputLabel, 
    AddAlertDialogAdvancedSectionHead, 
    AlertIntervalInputLabel, 
    EscKeyCode,
    AlertNameMaxLength,
    AlertValueMaxLength,
    DeadbandValueMaxLength,
    ActivationDelayMaxLength,
    AlertIntervalMaxLength,
    MaxInputCharacterAddition
} from '../../common/GlobalConstants'
import { NameId, ValueId, DeadbandvalueId, ActivationDelayId, IntervalId, DeleteLabel, ValueLabel, EnableLabel, AlertInputValidatorID, NoButtonLabel, YesButtonLabel, DeleteAlertWarningHeading, DeleteAlertWarningMessage } from '../../common/GlobalConstants'

import validator from '../../common/InputValidations'
  
const styles = makeStyles(theme => ({
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
    }
}))

const alertDisplayCardStyle = makeStyles(theme => ({
    card: {
        width: '100%'
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

function AlertItem(props) {
    const cardClasses = alertDisplayCardStyle()
    const dispatch = useDispatch()
    const [advncShow, isAdvncShow] = useState(props.isFun ? true: false);
    const [isShow, isConfirm] = useState(false);
    const [alertDeleteID, setalertDeleteID] = useState('');
    const [tagDeleteID, settagDeleteID] = useState('');
    const classes = styles();
 
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
                        <h6>{DeleteAlertWarningHeading}</h6>
                        <p>{DeleteAlertWarningMessage}</p>
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

    function deleteFile(){
        dispatch(deleteAlert(alertDeleteID, tagDeleteID))
        isConfirm(false);
    }

    function showAdvanceSettings() {
        
        if(props.alertFunction == AlertFunctionListDefault){
            console.log(props.alertFunction)
            isAdvncShow(prev => !prev);
        }
        
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

    const deleteButtonClicked = () => {
        isConfirm(true);
        setalertDeleteID(props.alertId)
        settagDeleteID(props.tagId)
    }

    const editAction = () => {
        props.editAction(props)
    }

    function handleEnableChange(event){
        console.log(event.target.checked)
        console.log(event.target.value)
        const selectEnableID = event.target.value;
        console.log(props)

        const enableAlert = {
            "enabled": event.target.checked,
            "name": props.alertName,
            "tagId": props.tagId,
            "type": "string",
            "user": "string",
            "deadbandvalue": props.alertDeadband,
            "activationDelay": props.alertActivationDelay,
            "unit": props.alertUnit,
            "FQTagName": props.alertFQTagname,
            "function": props.alertFunction,
            "metadata": {},
            "context": "string",
            "alertinfo": {
                "condition": props.alertCondition,
                "value": props.alertValue,
                "interval": props.alertInterval,
                "unit": props.alertInfoUnit
            }
        }
        enableAlert.id = selectEnableID
        dispatch(updateAlert(enableAlert))
    }
   

    if (props.isForm) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={4}  key='alert-name_grid'>
                    <FormControl className={classes.root}>
                        <TextField onChange={props.handleInputValueChange}
                            helperText={props.errorMessage || validator.validate(NameId, props.alertName, AlertInputValidatorID).errorMessage}
                            error={props.isError || validator.validate(NameId, props.alertName, AlertInputValidatorID).isInvalid}
                            disabled={props.disabled}
                            id={NameId}
                            label={AlertNameInputLabel}
                            required={true}
                            name="alert-name"
                            size="small"
                            variant="outlined"
                            inputProps={{ maxLength: AlertNameMaxLength + MaxInputCharacterAddition }}
                            value={props.alertName} />
                    </FormControl>
                </Grid>
                <Grid item xs={4}  key='condition_grid'>
                    <FormControl variant="outlined" className={classes.root}>
                        <InputLabel id="select-label">{AlertConditionInputLabel}</InputLabel>
                        <Select value={props.alertCondition ? props.alertCondition : AlertConditionListDefault}
                            autoWidth={true}
                            labelId="select-label"
                            name="condition"
                            size="small"
                            disabled={props.disabled}
                            defaultValue={AlertConditionListDefault}
                            onChange={props.handleInputValueChange}
                            style={{
                                minWidth: 100
                            }}>
                            { Object.entries(AlertConditionList).map((j,s) => <MenuItem key={s} value={j[0]}>{j[1]}</MenuItem>) } 
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}  key='alert-value_grid'>
                    <FormControl className={classes.root}>
                        <TextField onChange={props.handleInputValueChange}
                            disabled={props.disabled}
                            helperText={validator.validate(ValueId, props.alertValue, AlertInputValidatorID).errorMessage}
                            error={validator.validate(ValueId, props.alertValue, AlertInputValidatorID).isInvalid}
                            id={ValueId}
                            label={AlertValueInputLabel}
                            required={true}
                            name="alert-value"
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: AlertValueMaxLength + MaxInputCharacterAddition }}
                            value={props.alertValue} />
                    </FormControl>
                </Grid>
                <Grid item xs={4}  key='deadband_grid'>
                    <FormControl className={classes.root}>
                        <TextField onChange={props.handleInputValueChange}
                            disabled={props.disabled || props.alertCondition == '=' ? true:false}
                            helperText={validator.validate(DeadbandvalueId, props.alertDeadband, AlertInputValidatorID).errorMessage}
                            error={validator.validate(DeadbandvalueId, props.alertDeadband, AlertInputValidatorID).isInvalid}
                            id={DeadbandvalueId}
                            label={AlertDeadbandInputLabel}
                            required={false}
                            name="deadband"
                            variant="outlined"
                            size="small"
                            inputProps={{ maxLength: DeadbandValueMaxLength + MaxInputCharacterAddition }}
                            value={props.alertCondition == '=' ? '' : props.alertDeadband} />
                    </FormControl>
                </Grid>
                <Grid item xs={8}  key='seperate-block_grid'>
                    <Card className="act-seperate-block" variant="outlined" >
                        <Grid item xs={6}  key='activationdelay_grid'>
                            <FormControl className={classes.root}>
                                <TextField onChange={props.handleInputValueChange}
                                    disabled={props.disabled}
                                    helperText={validator.validate(ActivationDelayId, props.alertActivationDelay, AlertInputValidatorID).errorMessage}
                                    error={validator.validate(ActivationDelayId, props.alertActivationDelay, AlertInputValidatorID).isInvalid}
                                    id={ActivationDelayId}
                                    label={AlertActivationDelayInputLabel}
                                    required={false}
                                    name="activationdelay"
                                    variant="outlined"
                                    inputProps={{ maxLength: ActivationDelayMaxLength + MaxInputCharacterAddition }}
                                    size="small"
                                    value={props.alertActivationDelay} />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}  key='select-unit_grid'>
                            <FormControl variant="outlined" className={classes.root}>
                                <InputLabel id="select-unit">{AlertUnitInputLabel}</InputLabel>
                                <Select value={props.alertUnit ? props.alertUnit : AlertUnitListDefault}
                                    autoWidth={true}
                                    id="unit"
                                    labelId="select-unit"
                                    required={true}
                                    name="unit"
                                    size="small"
                                    disabled={props.disabled}
                                    defaultValue={AlertUnitListDefault}
                                    onChange={props.handleInputValueChange}>
                                    { Object.entries(AlertUnitList).map((x,y) => <MenuItem key={y} value={x[0]}>{x[1]}</MenuItem>) } 
                                </Select>
                            </FormControl>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={12}  key='advanced-head_grid'>
                    <Typography onClick={showAdvanceSettings} className="alert-advnc-btn">{AddAlertDialogAdvancedSectionHead}</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={12}  key='advanced_grid'>
                    <div className="alert-advanced-feature" style={{ display: (advncShow || props.alertFunction !=AlertFunctionListDefault ? "block" : "none") }}>
                        <Grid container spacing={3}>
                            <Grid item xs={4}  key='functions_grid'>
                                <FormControl variant="outlined" className={classes.root}>
                                    <InputLabel id="select-function">{AlertFunctionInputLabel}</InputLabel>
                                    <Select value={props.alertFunction ? props.alertFunction : AlertFunctionListDefault}
                                        autoWidth={true}
                                        id="function"
                                        labelId="select-function"
                                        name="function"
                                        size="small"
                                        disabled={props.disabled}
                                        defaultValue={AlertFunctionListDefault}
                                        onChange={props.handleInputValueChange}
                                        style={{
                                            minWidth: 100
                                        }}>
                                        
                                        { Object.entries(AlertFunctionList).map((t,k) => <MenuItem key={k} value={t[0]}>{t[1]}</MenuItem>) } 

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}  key='interval_grid'>
                                <FormControl className={classes.root} style={{ display: props.isFunSelected }}>
                                    <TextField onChange={props.handleInputValueChange}
                                        disabled={props.disabled}
                                        id={IntervalId}
                                        helperText={validator.validate(IntervalId, props.alertInterval, AlertInputValidatorID).errorMessage}
                                        error={validator.validate(IntervalId, props.alertInterval, AlertInputValidatorID).isInvalid}
                                        label={AlertIntervalInputLabel}
                                        required={props.alertFunction !=AlertFunctionListDefault ? true : false}
                                        name="interval"
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ maxLength: AlertIntervalMaxLength + MaxInputCharacterAddition }}
                                        value={props.alertInterval}
                                        style={{
                                            display: props.isFunSelected

                                        }} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}  key='infounit_grid'>
                                <FormControl variant="outlined" className={classes.root}>
                                    <InputLabel id="select-infounit" style={{ display: props.isFunSelected }}>{AlertUnitInputLabel}</InputLabel>
                                    <Select value={props.alertInfoUnit ? props.alertInfoUnit : AlertFunctionDefaultUnit}
                                        autoWidth={true}
                                        id="infounit"
                                        labelId="select-infounit"
                                        required={props.unitShow == "block" ? true : false}
                                        name="infounit"
                                        size="small"
                                        disabled={props.disabled}
                                        defaultValue={AlertFunctionDefaultUnit}
                                        onChange={props.handleInputValueChange}
                                        style={{
                                            display: props.isFunSelected
                                        }}>
                                        { Object.entries(AlertUnitList).map((x,y) => <MenuItem key={y} value={x[0]}>{x[1]}</MenuItem>) } 
                                    </Select>
                                </FormControl>

                                <FormControl className="hidden-input">
                                    <TextField  
                                    type="hidden"
                                    name="advance"
                                    id="advance"
                                    value={advncShow ? 1 : 0} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>
                 </Grid>
                <Grid item xs={12}  key='submit_grid'>
                    <div className="alert-modal-btns">
                        <Button autoFocus variant="outlined" color="primary" type="submit" form="alert-form"><AddOutlinedIcon />  Add</Button>
                    </div>
                </Grid>
            </Grid>
        )
    }
    else {
        return (
            <Card className={cardClasses.card} variant="outlined" >
                <div>
                {confirmDeleteAction()}
                </div>
                <CardContent style={
                    {
                        padding: 0
                    }
                }>
                    <div className="alert-content-box">
                        <div className="alert-enable-box">
                        <Tooltip title={EnableLabel} placement="top" arrow><FormControlLabel control={ <Checkbox value={props.alertId} color="primary" defaultChecked={props.alertEnable} onChange={handleEnableChange}/> } /></Tooltip>
                        </div>
                        <div className="alert-info-box">
                            <span className="alert-name" onClick={editAction}>{props.alertName}</span>
                            
							<span className="alert-function">{props.alertFunction == AlertFunctionListDefault ? ValueLabel : props.alertFunction+' ('+ValueLabel+')'}</span>
                            <span className="alert-condtion">{props.alertCondition}</span>
                            <span className="alert-value">{props.alertValue}</span>
                        </div>
                        <div className="alert-action-box">
                        <Tooltip title={DeleteLabel} placement="top" arrow><span><DeleteOutlineOutlinedIcon onClick={deleteButtonClicked} /></span></Tooltip>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

export default AlertItem