//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import { useDispatch } from 'react-redux'
import { setToastData, postConfig } from '../../redux'
import {
    ToastMessageTypes,
    SMSConfigURLInputLabel,
    SMSConfigTokenVarInputLabel,
    SMSConfigTokenInputLabel,
    SMSConfigSenderInputLabel, 
    SMSConfigSenderVarNameInputLabel,
    SMSConfigMessageVarNameInputLabel,
    SMSConfigNumbersVarNameInputLabel,
    SMSConfigTokenInputID,
    SMSConfigUrlnputID,
    SMSConfigTokenVarNameID,
    SMSConfigNumbersVarNameID,
    SMSConfigMessageVarNameID,
    SMSConfigSenderVarNameID,
    SMSConfigSenderInputID,
    SMSValidatorID,
    SMSTokenMaxLength,
    SMSConfigSenderMaxLength,
    MaxInputCharacterAddition

} from '../../common/GlobalConstants';

import validator from '../../common/InputValidations'

const formControlStyle = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
        color: 'rgba(45, 45, 45, 0.87)'
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: "wrap",
        justifyContent: 'flex-start',
    }
}))

function SMSConfig(props) {

    const classes = formControlStyle();
    const dispatch = useDispatch()

    const [url, setUrl] = React.useState(props.smsconfigdata.url ? props.smsconfigdata.url : '')
    const [tokenvarname, setTokenvarname] = React.useState(props.smsconfigdata.tokenvarname ? props.smsconfigdata.tokenvarname : '')
    const [token, setToken] = React.useState(props.smsconfigdata.token ? props.smsconfigdata.token : '')
    const [numbersvarname, setNumbersvarname] = React.useState(props.smsconfigdata.numbersvarname ? props.smsconfigdata.numbersvarname : '')
    const [messagevarname, setMessagevarname] = React.useState(props.smsconfigdata.messagevarname ? props.smsconfigdata.messagevarname : '')
    const [sendervarname, setSendervarname] = React.useState(props.smsconfigdata.sendervarname ? props.smsconfigdata.sendervarname : '')
    const [sender, setSender] = React.useState(props.smsconfigdata.sender ? props.smsconfigdata.sender : '')

    const submitSMSConfig = (e) => {

        var hasError = false
        e.preventDefault()

        hasError = validator.validate(SMSConfigUrlnputID, url, SMSValidatorID).isInvalid ||
            validator.validate(SMSConfigTokenVarNameID, tokenvarname, SMSValidatorID).isInvalid ||
            validator.validate(SMSConfigTokenInputID, token, SMSValidatorID).isInvalid ||
            validator.validate(SMSConfigNumbersVarNameID, numbersvarname, SMSValidatorID).isInvalid ||
            validator.validate(SMSConfigMessageVarNameID, messagevarname, SMSValidatorID).isInvalid ||
            validator.validate(SMSConfigSenderVarNameID, sendervarname, SMSValidatorID).isInvalid ||
            validator.validate(SMSConfigSenderInputID, sender, SMSValidatorID).isInvalid

        if (hasError) {
            console.log("Error: Invlalid inputs !!!")
            dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: "Error: Invalid Inputs!!!"
            }))
        } else {
            console.log(props.smsconfigdata)
            var config = props.smsconfigdata

            config = {
                ...config,
                url: url,
                tokenvarname: tokenvarname,
                token: token,
                numbersvarname: numbersvarname,
                messagevarname: messagevarname,
                sendervarname: sendervarname,
                sender: sender
            }
            dispatch(postConfig(config))
            
        }

    }

    return (
        <form id="SMS-config-form" onSubmit={submitSMSConfig}>
            <div className={classes.formContainer} >
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.isDisabled}
                        onChange={(e) => {
                            setUrl(e.target.value)
                        }}
                        id={SMSConfigUrlnputID}
                        label={SMSConfigURLInputLabel}
                        type="text"
                        required={true}
                        variant="outlined"
                        name={SMSConfigUrlnputID}
                        value={url} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.isDisabled}
                        onChange={(e) => {
                            setTokenvarname(e.target.value)
                        }}
                        id={SMSConfigTokenVarNameID}
                        type="text"
                        variant="outlined"
                        required={true}
                        label={SMSConfigTokenVarInputLabel}
                        name={SMSConfigTokenVarNameID}
                        value={tokenvarname} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.isDisabled}
                        onChange={(e) => {
                            setToken(e.target.value)
                        }}
                        error={validator.validate(SMSConfigTokenInputID, token, SMSValidatorID).isInvalid}
                        helperText={validator.validate(SMSConfigTokenInputID, token, SMSValidatorID).errorMessage}
                        id={SMSConfigTokenInputID}
                        label={SMSConfigTokenInputLabel}
                        variant="outlined"
                        required={true}
                        type="text"
                        inputProps={{ maxLength: SMSTokenMaxLength + MaxInputCharacterAddition }}
                        name={SMSConfigTokenInputID}
                        value={token} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.isDisabled}
                        onChange={(e) => {
                            setNumbersvarname(e.target.value)
                        }}
                        id={SMSConfigNumbersVarNameID}
                        type="text"
                        variant="outlined"
                        required={true}
                        label={SMSConfigNumbersVarNameInputLabel}
                        name={SMSConfigNumbersVarNameID}
                        value={numbersvarname} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.isDisabled}
                        onChange={(e) => {
                            setMessagevarname(e.target.value)
                        }}
                        id={SMSConfigMessageVarNameID}
                        label={SMSConfigMessageVarNameInputLabel}
                        type="text"
                        variant="outlined"
                        required={true}
                        name={SMSConfigMessageVarNameID}
                        value={messagevarname} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.isDisabled}
                        onChange={(e) => {
                            setSendervarname(e.target.value)
                        }}
                        id={SMSConfigSenderVarNameID}
                        label={SMSConfigSenderVarNameInputLabel}
                        type="text"
                        variant="outlined"
                        required={true}
                        name={SMSConfigSenderVarNameID}
                        value={sendervarname} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.isDisabled}
                        onChange={(e) => {
                            setSender(e.target.value)
                        }}
                        error={validator.validate(SMSConfigSenderInputID, sender, SMSValidatorID).isInvalid}
                        helperText={validator.validate(SMSConfigSenderInputID, sender, SMSValidatorID).errorMessage}
                        id={SMSConfigSenderInputID}
                        label={SMSConfigSenderInputLabel}
                        variant="outlined"
                        required={true}
                        type="text"
                        inputProps={{ maxLength: SMSConfigSenderMaxLength + MaxInputCharacterAddition }}
                        name={SMSConfigSenderInputID}
                        value={sender} />
                </FormControl>
            </div>
        </form>
    )
}

export default SMSConfig