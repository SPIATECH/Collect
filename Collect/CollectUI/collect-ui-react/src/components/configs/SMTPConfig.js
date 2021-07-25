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
    SMTPConfigHostInputLabel,
    SMTPConfigFromInputLabel,
    SMTPConfigPortInputLabel,
    SMTPConfigUsernameInputLabel,
    SMTPConfigPasswordInputLabel,
    SMTPConfigHostInputID,
    SMTPConfigFromInputID,
    SMTPConfigPortInputID,
    SMTPConfigSMTPUsernameInputID,
    SMTPConfigPasswordInputID,
    ToastMessageTypes,
    SMTPValidatorID,
    SMTPPasswordMaxLength,
    SMTPUsernameMaxLength,
    SMTPPortMaxLength,
    SMTPHostMaxLength,
    MaxInputCharacterAddition
} from '../../common/GlobalConstants';
import validator from '../../common/InputValidations'

const formControlStyle = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2)
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

function SMTPConfig(props) {

    const classes = formControlStyle();
    const dispatch = useDispatch()

    const [host, setHost] = React.useState(props.smtpconfigdata.host ? props.smtpconfigdata.host : '')
    const [from, setFrom] = React.useState(props.smtpconfigdata.from ? props.smtpconfigdata.from : '')
    const [port, setPort] = React.useState(props.smtpconfigdata.port ? props.smtpconfigdata.port : '')
    const [smtpusername, setSmtpusername] = React.useState(props.smtpconfigdata.smtpusername ? props.smtpconfigdata.smtpusername : '')
    const [password, setPassword] = React.useState(props.smtpconfigdata.password ? props.smtpconfigdata.password : '')

    const submitSMTPConfig = (e) => {

        e.preventDefault();
        var hasError = false;

        hasError = validator.validate(SMTPConfigHostInputID, host, SMTPValidatorID).isInvalid ||
            validator.validate(SMTPConfigFromInputID, from, SMTPValidatorID).isInvalid ||
            validator.validate(SMTPConfigPortInputID, port, SMTPValidatorID).isInvalid ||
            validator.validate(SMTPConfigSMTPUsernameInputID, smtpusername, SMTPValidatorID).isInvalid || 
            validator.validate(SMTPConfigPasswordInputID, password, SMTPValidatorID).isInvalid   
            
        if (hasError) {
            console.log("Error: Invlalid inputs !!!")
            dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: "Error: Invalid Inputs!!!"
            }))
        }else {
            console.log(props.smtpconfigdata)
            var config = props.smtpconfigdata

            config = {
                ...config,
                host: host,
                from: from,
                port: port,
                smtpusername: smtpusername,
                password: password
            }
           dispatch(postConfig(config))
        }
    }

    return (
        <form id="SMTP-config-form" className="tab-fixe-h" onSubmit={submitSMTPConfig}>
            <div className={classes.formContainer} >
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.editable}
                        error={validator.validate(SMTPConfigHostInputID, host, SMTPValidatorID).isInvalid}
                        helperText={validator.validate(SMTPConfigHostInputID, host, SMTPValidatorID).errorMessage}
                        onChange={(e) => {
                            setHost(e.target.value)
                        }}
                        id={SMTPConfigHostInputID}
                        label={SMTPConfigHostInputLabel}
                        variant="outlined"
                        required={true}
                        type="text"
                        inputProps={{ maxLength: SMTPHostMaxLength + MaxInputCharacterAddition }}
                        name={SMTPConfigHostInputID}
                        value={host} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.editable}
                        error={validator.validate(SMTPConfigFromInputID, from, SMTPValidatorID).isInvalid}
                        helperText={validator.validate(SMTPConfigFromInputID, from, SMTPValidatorID).errorMessage}
                        onChange={(e) => {
                            setFrom(e.target.value)
                        }}
                        id={SMTPConfigFromInputID}
                        label={SMTPConfigFromInputLabel}
                        variant="outlined"
                        required={true}
                        type="text"
                        name={SMTPConfigFromInputID}
                        value={from} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.editable}
                        error={validator.validate(SMTPConfigPortInputID, port, SMTPValidatorID).isInvalid}
                        helperText={validator.validate(SMTPConfigPortInputID, port, SMTPValidatorID).errorMessage}
                        onChange={(e) => {
                            setPort(e.target.value)
                        }}
                        id={SMTPConfigPortInputID}
                        label={SMTPConfigPortInputLabel}
                        variant="outlined"
                        required={true}
                        type="text"
                        inputProps={{ maxLength: SMTPPortMaxLength + MaxInputCharacterAddition }}
                        name={SMTPConfigPortInputID}
                        value={port} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.editable}
                        error={validator.validate(SMTPConfigSMTPUsernameInputID, smtpusername, SMTPValidatorID).isInvalid}
                        helperText={validator.validate(SMTPConfigSMTPUsernameInputID, smtpusername, SMTPValidatorID).errorMessage}
                        onChange={(e) => {
                            setSmtpusername(e.target.value)
                        }}
                        id={SMTPConfigSMTPUsernameInputID}
                        label={SMTPConfigUsernameInputLabel}
                        variant="outlined"
                        required={true}
                        type="text"
                        inputProps={{ maxLength: SMTPUsernameMaxLength + MaxInputCharacterAddition }}
                        name={SMTPConfigSMTPUsernameInputID}
                        value={smtpusername} />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField disabled={props.editable}
                        error={validator.validate(SMTPConfigPasswordInputID, password, SMTPValidatorID).isInvalid}
                        helperText={validator.validate(SMTPConfigPasswordInputID, password, SMTPValidatorID).errorMessage}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        id={SMTPConfigPasswordInputID}
                        label={SMTPConfigPasswordInputLabel}
                        type="password"
                        required={true}
                        name={SMTPConfigPasswordInputID}
                        variant="outlined"
                        inputProps={{ maxLength: SMTPPasswordMaxLength + MaxInputCharacterAddition }}
                        value={password} 
                        autoComplete="new-password"/>
                </FormControl>
            </div>
        </form>
    )
}

export default SMTPConfig