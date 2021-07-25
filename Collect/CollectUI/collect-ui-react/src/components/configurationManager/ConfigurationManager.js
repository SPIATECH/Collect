//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react'
import Header from '../header/Header'
import Button from '@material-ui/core/Button'
import SMSConfig from '../configs/SMSConfig';
import SMTPConfig from '../configs/SMTPConfig';
import './ConfigurationManager.scss'
import { connect } from 'react-redux'
import ConfigExpander from '../configs/ConfigExpander'
import SaveIcon from '@material-ui/icons/Save'
import MuiAlert from '@material-ui/lab/Alert';
import {
    SMTPConfigHeader,
    SMSConfigHeader,
    SaveButtonLabel,
} from '../../common/GlobalConstants';

const mapStateToProps = store => {
    return {
        smsConfig: store.config.sms,
        smtpConfig: store.config.smtp
    }
}
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ConfigurationManager extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isSMSEditing: false,
            isSMTPEditing: false,
            ToastSMTPConfig:0,
            ToastSMSConfig:0
        }
    }

    handleValueChange = (source) => {
        console.log(source.name)
        console.log(source.value)

        this.setState()

        if (source.name == 'host') {
            console.log(source.value)
            this.setState({
                smtpConfig: {
                    ...this.state.smtpConfig,
                    host: source.value
                }
            })
        }
        else if (source.name == 'port') {
            this.setState({
                smtpConfig: {
                    ...this.state.smtpConfig,
                    port: source.value
                }
            })
        }
        else if (source.name == 'smtpusername') {
            this.setState({
                smtpConfig: {
                    ...this.state.smtpConfig,
                    smtpusername: source.value
                }
            })
        }
        else if (source.name == 'password') {
            this.setState({
                smtpConfig: {
                    ...this.state.smtpConfig,
                    password: source.value
                }
            })
        }
        else if (source.name == 'token') {
            this.setState({
                smsConfig: {
                    ...this.state.smsConfig,
                    token: source.value
                }
            })
        }
    }

    render() {

        if (this.props.smsConfig && this.props.smtpConfig) {
            return (
                <div style={{ height: "100%" }}>
                    <Header title={this.props.title}
                        description={this.props.description} />
                    <div className="tabContentarea configurationManagerContainer">
                        <div className="tab-fixe-h" >
                            <ConfigExpander content={<SMSConfig
                                smsconfigdata={this.props.smsConfig}
                                isDisabled={false} />}
                                title={SMSConfigHeader}
                                actions={
                                    <div>
                                        <Button form="SMS-config-form"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SaveIcon />}
                                            type="submit"
                                            disabled={this.state.isSMSEditing}>{SaveButtonLabel}
                                        </Button>
                                    </div>
                                } />
                        </div>
                        <div>
                            <ConfigExpander content={<SMTPConfig
                                smtpconfigdata={this.props.smtpConfig}
                                isDisabled={false} />}
                                title={SMTPConfigHeader}
                                actions={
                                    <div>
                                        <Button variant="contained"
                                            form="SMTP-config-form"
                                            color="primary"
                                            startIcon={<SaveIcon />}
                                            type="submit"
                                            disabled={this.state.isSMTPEditing}>{SaveButtonLabel}
                                        </Button>
                                    </div>
                                } />
                        </div>
                    </div>

                </div>
            )
        }
        else { return null }

    }
}

export default connect(mapStateToProps)(ConfigurationManager)