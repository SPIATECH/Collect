//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import LocalTheme from '../theme'

export const theme = LocalTheme.createTheme()

export const APPHOST = window.location.origin

//export const APPHOST = "http://127.0.0.1:8090"


export const MaxInputCharacterAddition = 1

//Refresh disableLabel
export const RefreshDisableDuration = 4000

//Key Code
export const EscKeyCode = 27
export const EnterKeyCode = 13

// Authentication Constants
export const LocalStorageKeyId = 'collectUserInfo'

export const SoftwareVersionLabel = theme.props.label.softwareVersionLabel

//ProgressBar
export const ProgressBarEvents = {
    openBar: true,
    closeBar: false
}

// Toast Notification
export const ToastNotificationAutohideDuration = 6000
export const ToastMessageTypes = {
    success: 'success',
    error: 'error'
}


export const UnGroupName = 'UnGrouped'
export const FirstLevelGroupParentId = '00000000-0000-0000-0000-000000000000'
export const CollectUnGroupId = '11111111-1111-1111-1111-111111111111'
export const SMTPConfigID = 'smtp'
export const SMSConfigID = 'sms'

//SMS Config Constants

export const SMSConfigTokenInputID = "token"
export const SMSConfigUrlnputID = "url"
export const SMSConfigTokenVarNameID = "tokenvarname"
export const SMSConfigNumbersVarNameID = "numbersvarname"
export const SMSConfigMessageVarNameID = "messagevarname"
export const SMSConfigSenderVarNameID = "sendervarname"
export const SMSConfigSenderInputID = "sender"

export const SMSValidatorID = "smsconfig"

export const SMSConfigToken = ""
export const SMSTokenMaxLength = 128
export const SMSTokenMaxLengthErrorMessage = theme.props.warningMessages.smsTokenMaxLengthError
export const SMSTokenMinLengthErrorMessage = theme.props.warningMessages.smsTokenMinLengthError
export const SMSTokenValueError = theme.props.warningMessages.smsTokenValueError
export const SMSTokenMinLength = 8
export const SMSTokenRegX = /^$|^[a-zA-Z0-9-]*$/

export const SMSConfigURL = 'https://api.textlocal.in/send?'
export const SMSConfigTokenVarName = 'apikey'
export const SMSConfigNumbersVarName = 'numbers'
export const SMSConfigMessageVarName = 'message'
export const SMSConfigSenderVarName = 'sender'
export const SMSConfigSender = 'SPIAIS'
export const SMSConfigSenderMaxLength = 128
export const SMSConfigSenderLengthErrorMessage = theme.props.warningMessages.smsConfigSenderLengthErrorMessage

//SMTP Config Constants
export const SMTPConfigFrom = ''

export const SMTPConfigHostInputID = "host"
export const SMTPConfigFromInputID = "from"
export const SMTPConfigPortInputID = "port"
export const SMTPConfigSMTPUsernameInputID = "smtpusername"
export const SMTPConfigPasswordInputID = "password"

export const SMTPConfigHost = ""
export const SMTPHostMaxLength = 128
export const SMTPHostMaxLengthErrorMessage = theme.props.warningMessages.smtpHostMaxLengthError
export const SMTPHostMinLengthErrorMessage = theme.props.warningMessages.smtpHostMinLengthError
export const SMTPHostValueError = theme.props.warningMessages.smtpHostValueError
export const SMTPHostRegX = /^((?:(ftps?|https?):\/\/)?((?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9])\.)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9][0-9]|[0-9]))|(?:(?:(?:[a-zA-Z0-9._-]+){1,2}[\w]{2,4})))(?::(\d+))?((?:\/[\w]+)*)(?:\/|(\/[\w]+\.[\w]{3,4})|(\?(?:([\w]+=[\w]+)&)*([\w]+=[\w]+))?|\?(?:(wsdl|wadl))))$/

export const SMTPConfigPort = '465'
export const SMTPPortMaxLength = 8
export const SMTPPortMaxLengthErrorMessage = theme.props.warningMessages.smtpPortMaxLengthError
export const SMTPPortMinLengthErrorMessage = theme.props.warningMessages.smtpPortMinLengthError
export const SMTPPortValueError = theme.props.warningMessages.smtpPortValueError
export const SMTPPortMinLength = 2
export const SMTPPortRegX = /^[0-9]*$/

export const SMTPConfigUsername = ""
export const SMTPUsernameMaxLength = 128
export const SMTPUsernameMaxLengthErrorMessage = theme.props.warningMessages.smtpUsernameMaxLengthError
export const SMTPUsernameMinLengthErrorMessage = theme.props.warningMessages.smtpUsernameMinLengthError
export const SMTPUsernameValueError = theme.props.warningMessages.smtpUsernameValueError
export const SMTPUsernameMinLength = 1
export const SMTPUsernameRegX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const SMTPConfigPassword = ""
export const SMTPPasswordMaxLength = 128
export const SMTPPasswordMaxLengthErrorMessage = theme.props.warningMessages.smtpPasswordMaxLengthError
export const SMTPPasswordMinLengthErrorMessage = theme.props.warningMessages.smtpPasswordMinLengthError
export const SMTPPasswordMinLength = 1

export const SMTPValidatorID = "smtpconfig"

export const DefaultSMSConfigJSON = {
    "id": SMSConfigID,
    "url": SMSConfigURL,
    "tokenvarname": SMSConfigTokenVarName,
    "token": SMSConfigToken,
    "numbersvarname": SMSConfigNumbersVarName,
    "messagevarname": SMSConfigMessageVarName,
    "sendervarname": SMSConfigSenderVarName,
    "sender": SMSConfigSender
}

export const DefaultSMTPConfigJSON = {
    "id": SMTPConfigID,
    "host": SMTPConfigHost,
    "from": SMTPConfigFrom,
    "port": SMTPConfigPort,
    "username": SMTPConfigUsername,
    "password": SMTPConfigPassword
}

//Import

export const ImportProgressPopupLabel = theme.props.label.importProgressPopupLabel
export const ImportProgressPopupRollbackLabel = theme.props.label.importProgressPopupRollbackLabel
export const ImportAlertEmptyAlert = theme.props.toastMessages.importAlertEmptyAlert
export const ImportDeleteAlerts = theme.props.toastMessages.importDeleteAlerts
export const ImportFileExtensionError = theme.props.toastMessages.importFileExtensionError
export const ImportFileContentError = theme.props.toastMessages.importFileContentError
export const ImportAlertFailed = theme.props.toastMessages.importAlertFailed
export const ImportNotificationFailed = theme.props.toastMessages.importNotificationFailed
export const ImportConfigFailed = theme.props.toastMessages.importConfigFailed
export const ImportSuccess = theme.props.toastMessages.importSuccess
export const ImportRollback = theme.props.toastMessages.importRollback
export const ImportRollbackFailed = theme.props.toastMessages.importRollbackFailed
export const ImportFailedAction = theme.props.toastMessages.importFailedAction

//Export
export const ExportProgressPopupLabel = theme.props.label.exportProgressPopupLabel
export const ExportSuccess = theme.props.toastMessages.exportSuccess
export const ExportFailed = theme.props.toastMessages.exportFailed

//Dashboard
export const DashboardDeviceCountHeading = theme.props.headings.dashboardDeviceCountHeading
export const DashboardDeviceCountSubHeading = theme.props.headings.dashboardDeviceCountSubHeading

export const DashboardGroupCountHeading = theme.props.headings.dashboardGroupCountHeading
export const DashboardGroupCountSubHeading = theme.props.headings.dashboardGroupCountSubHeading

export const DashboardTagCountHeading = theme.props.headings.dashboardTagCountHeading
export const DashboardTagCountSubHeading = theme.props.headings.dashboardTagCountSubHeading

export const DashboardAlertCountHeading = theme.props.headings.dashboardAlertCountHeading
export const DashboardAlertCountSubHeading = theme.props.headings.dashboardAlertCountSubHeading

export const DashboardNotificationCountHeading = theme.props.headings.dashboardNotificationCountHeading
export const DashboardNotificationCountSubHeading = theme.props.headings.dashboardNotificationCountSubHeading

//Tag
export const TagListCountperPage = {
    default: 13,
    option_1: 25,
    option_2: 50
}

//Notification 
export const NotificationAlertListCountperPage = {
    default: 10,
    option_1: 25,
    option_2: 50
}
export const NotificationListPageCount = 8

export const NotificationPageDefaultHeading = theme.props.headings.notificationPageDefaultHeading
export const NotificationAlertDialogHeading = theme.props.headings.notificationAlertDialogHeading
export const NotificationNoAlertsListHeading = theme.props.headings.notificationNoAlertsListHeading
export const NotificationEmailMessageLength = 400
export const NotificationSMSMessageLength = 140

// Notification Form Inputfield Ids
export const NotificationNameId = "notificationname"
export const NotificationEmailId = "notificationemail"
export const NotificationPhoneId = "notificationphone"
export const NotificationEmailSubjectId = "notificationemailsubject"
export const NotificationEmailMessageId = "notificationemailmessage"
export const NotificationSmsMessageId = "notificationsmsmessage"
export const NotificationEmailSMSCommonError = theme.props.warningMessages.notificationEmailSMSCommonError
export const NotificationFormSubmitError = theme.props.warningMessages.notificationFormSubmitError
export const NotificationAddedSuccesMessage = theme.props.warningMessages.notificationAddedSuccesMessage
export const NotificationDeletedSuccesMessage = theme.props.warningMessages.notificationDeletedSuccesMessage
export const NotificationUpdatedSuccesMessage = theme.props.warningMessages.notificationUpdatedSuccesMessage
export const NotificationsMaxLimitReachedError = theme.props.warningMessages.notificationsMaxLimitReachedError
export const NotificationExistsErrorMessage = theme.props.warningMessages.notificationExistsErrorMessage

export const NotificationInputValidatorID = "notificationinput"

export const NotificationNameMaxLength = 128
export const NotificationNameMaxLengthErrorMessage = theme.props.warningMessages.notificationNameMaxLengthError
export const NotificationNameRegX = new RegExp("^[a-zA-Z0-9_-]*$")
export const NotificationNameErrorMessage = theme.props.warningMessages.notificationNameError

export const NotificationEmailMaxLength = 1024
export const NotificationEmailMaxLengthErrorMessage = theme.props.warningMessages.notificationEmailMaxLengthError
export const NotificationEmailMultipleRegex = /^[ ]*(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})[ ]*,[ ]*)*([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})[ ]*$/
export const NotificationEmailErrorMessage = theme.props.warningMessages.notificationEmailErrorMessage

export const NotificationPhoneMinLength = 10
export const NotificationPhoneMinLengthErrorMessage = theme.props.warningMessages.notificationPhoneMinLengthError
export const NotificationPhoneMaxLength = 1024
export const NotificationPhoneMaxLengthErrorMessage = theme.props.warningMessages.notificationPhoneMaxLengthError
export const NotificationPhoneMultipleRegex = /^[ ]?\d{10}([ ]?,[ ]?\d{10})*[ ]?$/
export const NotificationPhoneErrorMessage = theme.props.warningMessages.notificationPhoneErrorMessage

export const NotificationEmailMessageMinLength = 4
export const NotificationEmailMessageMaxLength = 1024
export const NotificationEmailMessageMinLengthErrorMessage = theme.props.warningMessages.notificationEmailMessageMinLengthError
export const NotificationEmailMessageMaxLengthErrorMessage = theme.props.warningMessages.notificationEmailMessageMaxLengthError

export const NotificationEmailSubjectMinLength = 4
export const NotificationEmailSubjectMaxLength = 140
export const NotificationEmailSubjectMinLengthErrorMessage = theme.props.warningMessages.notificationEmailSubjectMinLengthError
export const NotificationEmailSubjectMaxLengthErrorMessage = theme.props.warningMessages.notificationEmailSubjectMaxLengthError


export const NotificationSMSMessageMinLength = 4
export const NotificationSMSMessageMaxLength = 240
export const NotificationSMSMessageMinLengthErrorMessage = theme.props.warningMessages.notificationSMSMessageMinLengthError
export const NotificationSMSMessageMaxLengthErrorMessage = theme.props.warningMessages.notificationSMSMessageMaxLengthError

//Toast
export const ToastAutoHideDuration = 4000
export const ToastSetPosition = {
    vertical: 'bottom',
    horizontal: 'right'
}

// Alert 
export const AlertDialogHeading = theme.props.headings.alertDialogHeading
export const AlertFunctionList = {
    MEAN: 'Mean',
    MEDIAN: 'Median',
    DIFFERENCE: 'Difference',
    LAST: 'Select'
}

export const AlertConditionList = {
    '<': '<',
    '>': '>',
    '=': '=',
    '<=': '<=',
    '>=': '>='
}

export const AlertUnitList = {
    's': 'Second',
    'm': 'Minute',
    'h': 'Hour'
}

export const AlertExistsErrorMessage = theme.props.warningMessages.alertExistsErrorMessage

export const AlertFunctionListDefault = 'LAST'
export const AlertConditionListDefault = '>'
export const AlertUnitListDefault = 'm'
export const AlertFunctionDefaultUnit = 'm'

// Alert Form Inputfield Ids
export const NameId = "name"
export const ValueId = "value"
export const DeadbandvalueId = "deadbandvalue"
export const ActivationDelayId = "activationDelay"
export const IntervalId = "interval"
export const AlertFormSubmitError = theme.props.warningMessages.alertFormSubmitError
export const AddAlertSuccessMessage = theme.props.warningMessages.addAlertSuccesMessage
export const UpdateAlertSuccessMessage = theme.props.warningMessages.updateAlertSuccesMessage
export const DeleteAlertSuccessMessage = theme.props.warningMessages.deleteAlertSuccessMessage
export const AlertsMaxLimitReachedError = theme.props.warningMessages.alertsMaxLimitReachedError
export const AlertsTotalMaxLimitReachedError = theme.props.warningMessages.alertsTotalMaxLimitReachedError

//Email and SMS Default Template
export const SMSDefaultMessage = 'An alert {alertname} is generated for {tagname} from i4Suite at {timestamp}. Current Value     : {value}, applied function : {function}. Please take appropriate action'

export const EmailDefaultSubject = 'Alert {alertname} is generated for {tagname}, current value : {value}'
export const EmailDefaultMessage = `Hi
An alert {alertname} is generated for {tagname} at {timestamp}.
Current Value     : {value}
Applied function : {function}

Please take appropriate action. 

---------
i4 Suite`


// Import file extension
export const ImportFileExtension = 'i4alerts'

export const UnsavedDataWarningMessage = theme.props.warningMessages.unsavedDataWarningMessage

// Login Constants
export const LoginInputChatacterLimit = 128
export const UsernameLabel = theme.props.label.usernameLabel
export const PasswordLabel = theme.props.label.passwordLabel
export const LoginErrorText = theme.props.warningMessages.loginErrorText
export const UserLoggedOutMessage = theme.props.warningMessages.userLoggedOutError
export const FailedToLoginEnterCredentialsMessage = theme.props.warningMessages.failedToLoginEnterCredentialsMessage

// Validator Constants

export const AlertInputValidatorID = "alertinput"

export const AlertNameMaxLength = 128
export const AlertNameMaxLengthErrorMessage = theme.props.warningMessages.alertNameMaxLengthError
export const AlertNameRegX = new RegExp("^[a-zA-Z0-9_-]*$")
export const AlertNameErrorMessage = theme.props.warningMessages.alertNameError

export const AlertValueMaxLength = 10
export const AlertValueMaxLengthErrorMessage = theme.props.warningMessages.alertValueMaxLengthError
export const AlertValueRegX = new RegExp(/^$|^-?[0-9]+$|^-?[0-9]+\.[0-9]+$/)
export const AlertValueErrorMessage = theme.props.warningMessages.alertValueError

export const DeadbandValueMaxLength = 10
export const DeadbandValueMaxLengthErrorMessage = theme.props.warningMessages.deadbandValueMaxLengthError
export const DeadbandValueRegX = new RegExp(/^$|^[0-9]+$|^[0-9]+\.[0-9]+$/)
export const DeadbandValueErrorMessage = theme.props.warningMessages.deadbandValueError

export const ActivationDelayMaxLength = 10
export const ActivationDelayMaxLengthErrorMessage = theme.props.warningMessages.activationDelayMaxLengthError
export const ActivationDelayRegX = new RegExp(/^$|^[0-9]+$/)
export const ActivationDelayErrorMessage = theme.props.warningMessages.activationDelayError

export const AlertIntervalMaxLength = 10
export const AlertIntervalMaxLengthErrorMessage = theme.props.warningMessages.alertIntervalMaxLengthError
export const AlertIntervalRegX = new RegExp(/^$|^[0-9]+$/)
export const AlertIntervalErrorMessage = theme.props.warningMessages.alertIntervalError

export const ValueLabel = theme.props.label.valueLabel
export const SearchLabel = theme.props.label.searchLabel
export const CloseLabel = theme.props.label.closeLabel
export const EnableLabel = theme.props.label.enableLabel
export const DisableLabel = theme.props.label.disableLabel
export const DeleteLabel = theme.props.label.deleteLabel
export const EmailLabel = theme.props.label.emailLabel
export const SmsLabel = theme.props.label.smsLabel
export const SelectedAlertHeading = theme.props.headings.selectedAlertHeading
export const GroupsListHeading = theme.props.headings.groupsListHeading
export const TagsListHeading = theme.props.headings.tagsListHeading
export const NoTagsInfoMessage = theme.props.warningMessages.noTagsInfoMessage
export const LoginHeading = theme.props.headings.loginHeading
export const LoginButtonLabel = theme.props.label.loginButtonLabel
export const DashboardLinkLabel = theme.props.label.dashboardLinkLabel
export const AlertsLinkLabel = theme.props.label.alertsLinkLabel
export const NotificationsLinkLabel = theme.props.label.notificationsLinkLabel
export const SettingsLinkLabel = theme.props.label.settingsLinkLabel
export const ExportLinkLabel = theme.props.label.exportLinkLabel
export const ImportLinkLabel = theme.props.label.importLinkLabel
export const CommitLinkLabel = theme.props.label.commitLinkLabel
export const AlertsListHeading = theme.props.headings.alertsListHeading
export const AddAlertButtonLabel = theme.props.label.addAlertButtonLabel
export const AddAlertDialogAdvancedSectionHead = theme.props.headings.alertDialogAdvancedSectionHead
export const AlertNameInputLabel = theme.props.label.alertNameInputLabel
export const AlertConditionInputLabel = theme.props.label.AlertConditionInputLabel
export const AlertValueInputLabel = theme.props.label.alertValueInputLabel
export const AlertDeadbandInputLabel = theme.props.label.alertDeadbandInputLabel
export const AlertActivationDelayInputLabel = theme.props.label.alertActivationDelayInputLabel
export const AlertUnitInputLabel = theme.props.label.alertUnitInputLabel
export const AlertFunctionInputLabel = theme.props.label.alertFunctionInputLabel
export const AlertIntervalInputLabel = theme.props.label.alertIntervalInputLabel
export const AlertsTagsTableTagNameColumnHeader = theme.props.headings.alertsTagsTableTagNameColumnHeader
export const NotificationTagsTableTagNameColumnHeader = theme.props.headings.notificationTagsTableTagNameColumnHeader
export const NotificationTagsTableFQTagNameColumnHeader = theme.props.headings.notificationTagsTableFQTagNameColumnHeader
export const NotificationTagsTableTagFunctionColumnHeader = theme.props.headings.notificationTagsTableTagFunctionColumnHeader
export const NotificationTagsTableTagConditionColumnHeader = theme.props.headings.notificationTagsTableTagConditionColumnHeader
export const NotificationTagsTableTagValueColumnHeader = theme.props.headings.notificationTagsTableTagValueColumnHeader
export const SMTPConfigHeader = theme.props.headings.smtpConfigHeader
export const SMSConfigHeader = theme.props.headings.smsConfigHeader
export const SaveButtonLabel = theme.props.label.saveButtonLabel
export const BackButtonLabel = theme.props.label.backButtonLabel
export const YesButtonLabel = theme.props.label.yesButtonLabel
export const NoButtonLabel = theme.props.label.noButtonLabel
export const SendEmailButtonLabel = theme.props.label.sendEmailButtonLabel
export const SendSMSButtonLabel = theme.props.label.sendSMSButtonLabel
export const AddNotificationButtonLabel = theme.props.label.addNotificationButtonLabel
export const RecoveryAlertLabel = theme.props.label.recoveryAlertLabel
export const NotificaionNameLabel = theme.props.label.notificaionNameLabel
export const NotificationEmailLabel = theme.props.label.notificationEmailLabel
export const NotificationSubjectLabel = theme.props.label.notificationSubjectLabel
export const NotificationEmailMessageLabel = theme.props.label.notificationEmailMessageLabel
export const NotificationPhoneLabel = theme.props.label.notificationPhoneLabel
export const NotificationSMSMessageLabel = theme.props.label.notificationSMSMessageLabel
export const NotificationListHeading = theme.props.headings.notificationListHeading
export const DeleteNotificationWarningHeading = theme.props.headings.deleteNotificationWarningHeading
export const DeleteNotificationWarningMessage = theme.props.warningMessages.deleteNotificationWarningMessage
export const DeleteAlertWarningHeading = theme.props.headings.deleteAlertWarningHeading
export const DeleteAlertWarningMessage = theme.props.warningMessages.deleteAlertWarningMessage
export const AlertNotFoundMessage = theme.props.warningMessages.alertNotFoundMessage
export const NotificationNotFoundMessage = theme.props.warningMessages.notificationNotFoundMessage
export const AlertListEmptyMessage = theme.props.warningMessages.alertListEmptyMessage

// SMSConfig Input Labels
export const SMSConfigURLInputLabel = theme.props.label.smsConfigUrlInputLabel
export const SMSConfigTokenVarInputLabel = theme.props.label.smsConfigTokenVarInputLabel
export const SMSConfigTokenInputLabel = theme.props.label.smsConfigTokenInputLabel
export const SMSConfigNumbersVarNameInputLabel = theme.props.label.smsConfigNumbersVarNameInputLabel
export const SMSConfigMessageVarNameInputLabel = theme.props.label.smsConfigMessageVarNameInputLabel
export const SMSConfigSenderVarNameInputLabel = theme.props.label.smsConfigSenderVarNameInputLabel
export const SMSConfigSenderInputLabel = theme.props.label.smsConfigSenderInputLabel

// SMTPConfig Input Labels
export const SMTPConfigHostInputLabel = theme.props.label.smtpConfigHostInputLabel
export const SMTPConfigFromInputLabel = theme.props.label.smtpConfigFromInputLabel
export const SMTPConfigPortInputLabel = theme.props.label.smtpConfigPortInputLabel
export const SMTPConfigUsernameInputLabel = theme.props.label.smtpConfigUsernameInputLabel
export const SMTPConfigPasswordInputLabel = theme.props.label.smtpConfigPasswordInputLabel

//Toast Content Labels
export const CommitToastLabel = theme.props.toastMessages.commitSuccess
export const SMTPTUpdateSuccessToastMessage = theme.props.toastMessages.smtpUpdateSuccess
export const SMTPTUpdateFailToastMessage = theme.props.toastMessages.smtpUpdateFail
export const SMSUpdateSuccessToastMessage = theme.props.toastMessages.smsUpdateSuccess
export const SMSUpdateFailedToastMessage = theme.props.toastMessages.smsUpdateFail






//Collect constants start here
export const DataSourceLinkLabel = theme.props.collectLocals.dataSourceLinkLabel
export const DeviceTypeEmptyMessage = theme.props.collectLocals.deviceTypeEmptyMessage
export const NoDevicesInfoMessage = theme.props.collectLocals.noDevicesInfoMessage
export const TableNameColumnHeader = theme.props.collectLocals.tableNameColumnHeader
export const AddDeviceButtonLabel = theme.props.collectLocals.addDeviceButtonLabel
export const AddDeviceSuccessMessage = theme.props.collectLocals.addDeviceSuccessMessage
export const UpdateDeviceSuccessMessage = theme.props.collectLocals.updateDeviceSuccessMessage
export const DeleteDeviceWarningHeading = theme.props.collectLocals.deleteDeviceWarningHeading
export const DeleteDeviceWarningMessage = theme.props.collectLocals.deleteDeviceWarningMessage
export const DeleteDeviceSuccessMessage = theme.props.collectLocals.deleteDeviceSuccessMessage
export const TagListLabel = theme.props.collectLocals.tagListLabel
export const NoDeviceTagInfoMessage = theme.props.collectLocals.noTagListInfoMessage
export const AddTagButtonLabel = theme.props.collectLocals.addTagButtonLabel

export const AddTagSuccessMessage = theme.props.collectLocals.addTagSuccessMessage
export const UpdateTagSuccessMessage = theme.props.collectLocals.updateTagSuccessMessage
export const DeleteTagWarningHeading = theme.props.collectLocals.deleteTagWarningHeading
export const DeleteTagWarningMessage = theme.props.collectLocals.deleteTagWarningMessage
export const DeleteTagSuccessMessage = theme.props.collectLocals.deleteTagSuccessMessage

export const DeviceListCountperPage = {
    default: 15,
    option_1: 25,
    option_2: 50
}
export const DeviceTagListCountperPage = {
    default: 15,
    option_1: 25,
    option_2: 50
}

export const DeviceNameMaxLength = 128
export const DeviceNameMaxLengthErrorMessage = theme.props.collectLocals.deviceNameMaxLengthError
export const DeviceNameRegX = new RegExp("^[a-zA-Z0-9_-]*$")
export const DeviceNameErrorMessage = theme.props.collectLocals.deviceNameError
export const DeviceExistsErrorMessage = theme.props.collectLocals.deviceExistsErrorMessage

export const TagNameMaxLength = 128
export const TagNameMaxLengthErrorMessage = theme.props.collectLocals.tagNameMaxLengthError
export const TagNameRegX = new RegExp("^[a-zA-Z0-9_-]*$")
export const TagNameErrorMessage = theme.props.collectLocals.tagNameError
export const TagExistsErrorMessage = theme.props.collectLocals.tagExistsErrorMessage
