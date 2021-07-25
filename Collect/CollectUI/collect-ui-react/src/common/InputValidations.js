//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
    AlertInputValidatorID,
    AlertNameMaxLength,
    AlertNameMaxLengthErrorMessage,
    AlertNameRegX,
    AlertNameErrorMessage,
    
    AlertValueMaxLength,
    AlertValueMaxLengthErrorMessage,
    AlertValueRegX,
    AlertValueErrorMessage,
    
    DeadbandValueMaxLength,
    DeadbandValueMaxLengthErrorMessage,
    DeadbandValueRegX,
    DeadbandValueErrorMessage,
    
    ActivationDelayMaxLength,
    ActivationDelayMaxLengthErrorMessage,
    ActivationDelayRegX,
    ActivationDelayErrorMessage,
    
    AlertIntervalMaxLength,
    AlertIntervalMaxLengthErrorMessage,
    AlertIntervalRegX,
    AlertIntervalErrorMessage,

    // SMS Constants
    SMSConfigTokenInputID,
    SMSTokenMaxLength,
    SMSTokenMaxLengthErrorMessage,
    SMSTokenMinLength,
    SMSTokenMinLengthErrorMessage,
    SMSTokenRegX,
    SMSTokenValueError,
    SMSConfigSenderMaxLength,
    SMSConfigSenderInputID,
    SMSConfigSenderLengthErrorMessage,
    SMSValidatorID,

    // SMTP Constants
    SMTPValidatorID,
    SMTPConfigHostInputID,
    SMTPConfigFromInputID,
    SMTPConfigPortInputID,
    SMTPConfigSMTPUsernameInputID,
    SMTPConfigPasswordInputID,

    SMTPHostMaxLength,
    SMTPHostMaxLengthErrorMessage,
    SMTPHostRegX,
    SMTPHostValueError,

    SMTPPortMaxLength,
    SMTPPortMaxLengthErrorMessage,
    SMTPPortMinLengthErrorMessage,
    SMTPPortValueError,
    SMTPPortMinLength,
    SMTPPortRegX,

    SMTPUsernameMaxLength,
    SMTPUsernameMaxLengthErrorMessage,
    SMTPUsernameMinLengthErrorMessage,
    SMTPUsernameValueError,
    SMTPUsernameMinLength,
    SMTPUsernameRegX,

    SMTPPasswordMaxLength,
    SMTPPasswordMaxLengthErrorMessage,
    SMTPPasswordMinLengthErrorMessage,
    SMTPPasswordMinLength,

    //Notification Constants
    NotificationInputValidatorID,
    NotificationNameMaxLength,
    NotificationNameMaxLengthErrorMessage,
    NotificationNameRegX,
    NotificationNameErrorMessage,

    NotificationEmailMaxLength,
    NotificationEmailMaxLengthErrorMessage,
    NotificationEmailMultipleRegex,
    NotificationEmailErrorMessage,

    NotificationPhoneMinLength,
    NotificationPhoneMinLengthErrorMessage,
    NotificationPhoneMaxLength,
    NotificationPhoneMaxLengthErrorMessage,
    NotificationPhoneMultipleRegex,
    NotificationPhoneErrorMessage,

    NotificationEmailMessageMinLength,
    NotificationEmailMessageMaxLength,
    NotificationEmailMessageMinLengthErrorMessage,
    NotificationEmailMessageMaxLengthErrorMessage,

    NotificationEmailSubjectMinLength,
    NotificationEmailSubjectMaxLength,
    NotificationEmailSubjectMinLengthErrorMessage,
    NotificationEmailSubjectMaxLengthErrorMessage,


    NotificationSMSMessageMinLength,
    NotificationSMSMessageMaxLength,
    NotificationSMSMessageMinLengthErrorMessage,
    NotificationSMSMessageMaxLengthErrorMessage

} from './GlobalConstants'

class validateInput {

    validate(id, value = null, source = null) {

        // Notification Validation
        if (id && value && source && source === NotificationInputValidatorID) {
            
            if (id === "notificationname") {
                if (value.length > NotificationNameMaxLength) {
                    console.log("Error: Notification name maxlength exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationNameMaxLengthErrorMessage
                    }
                }
                else if (!NotificationNameRegX.test(value)) {
                    console.log("Error: Notification name invalid !!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationNameErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "notificationemail") {
                
                if (value.length > NotificationEmailMaxLength) {
                    console.log("Error: Email maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationEmailMaxLengthErrorMessage
                    }
                }
                else if (!NotificationEmailMultipleRegex.test(value)) {
                    console.log("Error: Email value invalid !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationEmailErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "notificationphone") {
                if (value.length < NotificationPhoneMinLength) {
                    console.log("Error: Phone no minvalue needed !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationPhoneMinLengthErrorMessage
                    }
                }
                else if (value.length > NotificationPhoneMaxLength) {
                    console.log("Error: Phone no maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationPhoneMaxLengthErrorMessage
                    }
                }
                else if (!NotificationPhoneMultipleRegex.test(value)) {
                    console.log("Error: Phone no invalid !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationPhoneErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "notificationemailsubject") {
                if (value.length < NotificationEmailSubjectMinLength) {
                    console.log("Error: Email Subject minvalue needed !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationEmailSubjectMinLengthErrorMessage
                    }
                }
                else if (value.length > NotificationEmailSubjectMaxLength) {
                    console.log("Error: Email Subject maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationEmailSubjectMaxLengthErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "notificationemailmessage") {
                if (value.length < NotificationEmailMessageMinLength) {
                    console.log("Error: Email Message minvalue needed !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationEmailMessageMinLengthErrorMessage
                    }
                }
                else if (value.length > NotificationEmailMessageMaxLength) {
                    console.log("Error: Email Message maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationEmailMessageMaxLengthErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "notificationsmsmessage") {
                if (value.length < NotificationSMSMessageMinLength) {
                    console.log("Error: SMS Message minvalue needed !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationSMSMessageMinLengthErrorMessage
                    }
                }
                else if (value.length > NotificationSMSMessageMaxLength) {
                    console.log("Error: SMS Message maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: NotificationSMSMessageMaxLengthErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }
        }

        // SMS Config Validation
        if (id && value && source && source === SMSValidatorID) {
            if (id === SMSConfigTokenInputID) {
                if (value.length > SMSTokenMaxLength) {
                    console.log("Error: SMS Token max length exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMSTokenMaxLengthErrorMessage
                    }
                }
                else if (value.length > 0 && value.length < SMSTokenMinLength) {
                    console.log("Error: SMS Token minimum ", SMSTokenMinLength, " needed !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMSTokenMinLengthErrorMessage
                    }
                }
                else if (!SMSTokenRegX.test(value)) {
                    console.log("SMS Token value invalid !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMSTokenValueError
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }
            else if (id === SMSConfigSenderInputID) {
                if (value.length > SMSConfigSenderMaxLength) {
                    console.log("Error: SMTP port name maxlength exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMSConfigSenderLengthErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ''
                    }
                }
            }
        }

        // SMTP Config Validation
        if (id && value && source && source == SMTPValidatorID) {
            if (id === SMTPConfigHostInputID) {
                if (value.length > SMTPHostMaxLength) {
                    console.log("Error: SMTP Host name maxlength exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPHostMaxLengthErrorMessage
                    }
                }
                else if (!SMTPHostRegX.test(value)) {
                    console.log("Error: Invalid hostname")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPHostValueError
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ''
                    }
                }
            }
            else if (id === SMTPConfigPortInputID) {
                if (value.length > SMTPPortMaxLength) {
                    console.log("Error: SMTP port name maxlength exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPPortMaxLengthErrorMessage
                    }
                }
                else if (value.length > 0 && value.length < SMTPPortMinLength) {
                    console.log("Error: SMTP port minimum length needed is ", SMTPPortMinLength," !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPPortMinLengthErrorMessage
                    }
                }
                else if (!SMTPPortRegX.test(value)) {
                    console.log("Error: Invalid port")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPPortValueError
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ''
                    }
                }
            }
            else if (id === SMTPConfigSMTPUsernameInputID) {
                if (value.length > SMTPUsernameMaxLength) {
                    console.log("Error: SMTP Username maxlength exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPUsernameMaxLengthErrorMessage
                    }
                }
                else if (value.length > 0 && value.length < SMTPUsernameMinLength) {
                    console.log("Error: SMTP Username minimum length needed is ", SMTPUsernameMinLength, " !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPUsernameMinLengthErrorMessage
                    }
                }
                /* else if (!SMTPUsernameRegX.test(value)) {
                    console.log("Error: Invalid Username")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPUsernameValueError
                    }
                } */
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ''
                    }
                }
            }
            else if (id === SMTPConfigPasswordInputID) {
                if (value.length > SMTPPasswordMaxLength) {
                    console.log("Error: SMTP Password maxlength exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPPasswordMaxLengthErrorMessage
                    }
                }
                else if (value.length > 0 && value.length < SMTPPasswordMinLength) {
                    console.log("Error: SMTP Password minimum length needed is ", SMTPPasswordMinLength, " !!!")
                    return {
                        isInvalid: true,
                        errorMessage: SMTPPasswordMinLengthErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ''
                    }
                }
            }
            else if (id === SMTPConfigFromInputID) {

            }
            else {
                return {
                    isInvalid: false,
                    errorMessage: ""
                }
            }
        }

        // Alert Input Validation
        if (id && value && source && source === AlertInputValidatorID) {

            if (id === "name") {
                if (value.length > AlertNameMaxLength) {
                    console.log("Error: Alert name maxlength exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: AlertNameMaxLengthErrorMessage
                    }
                }
                else if (!AlertNameRegX.test(value)) {
                    console.log("Error: Alert name invalid !!")
                    return {
                        isInvalid: true,
                        errorMessage: AlertNameErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "value") {
                if (value.length > AlertValueMaxLength) {
                    console.log("Error: Alert value maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: AlertValueMaxLengthErrorMessage
                    }
                }
                else if (!AlertValueRegX.test(value)) {
                    console.log("Error: Alert value invalid !!!")
                    return {
                        isInvalid: true,
                        errorMessage: AlertValueErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "deadbandvalue") {
                if (value.length > DeadbandValueMaxLength) {
                    console.log("Error: Alert deadband maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: DeadbandValueMaxLengthErrorMessage
                    }
                }
                else if (!DeadbandValueRegX.test(value)) {
                    console.log("Error: Alert deadband value invalid !!!")
                    return {
                        isInvalid: true,
                        errorMessage: DeadbandValueErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "activationDelay") {
                if (value.length > ActivationDelayMaxLength) {
                    console.log("Error: Alert activatiodelay maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: ActivationDelayMaxLengthErrorMessage
                    }
                }
                else if (!ActivationDelayRegX.test(value)) {
                    console.log("Error: Alert activationdelay value invalid !!!")
                    return {
                        isInvalid: true,
                        errorMessage: ActivationDelayErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

            else if (id === "interval") {
                if (value.length > AlertIntervalMaxLength) {
                    console.log("Error: Alert interval maxvalue exceeded !!!")
                    return {
                        isInvalid: true,
                        errorMessage: AlertIntervalMaxLengthErrorMessage
                    }
                }
                else if (!AlertIntervalRegX.test(value)) {
                    console.log("Error: Alert interval value invalid !!!")
                    return {
                        isInvalid: true,
                        errorMessage: AlertIntervalErrorMessage
                    }
                }
                else {
                    return {
                        isInvalid: false,
                        errorMessage: ""
                    }
                }
            }

        }
        
        else {
            return {
                isInvalid: false,
                errorMessage: ""
            }
        }
    }
}

export default new validateInput()