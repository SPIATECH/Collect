//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Logo from '../../assets/Collect-x_Logo.png'

import { makeStyles } from '@material-ui/core/styles'
import { 
    userLogin,
    setToastData 
} from '../../redux'
import { connect } from 'react-redux'
import { 
    UsernameLabel, 
    PasswordLabel, 
    LoginHeading, 
    LoginButtonLabel,
    FailedToLoginEnterCredentialsMessage,
    ToastMessageTypes,
    LoginInputChatacterLimit,
    LocalStorageKeyId
 } from '../../common/GlobalConstants';

const paperStyle = makeStyles(theme => ({
    root: {
        width: "100%",
        textAlign: 'center',
        maxWidth: '500px',
        maxHeight: '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        '& > *': {
            marginTop: '30px',
            marginBottom: '30px',
            padding: '20px 10px'
        },
        '& .MuiOutlinedInput-input': {
            padding: '12.5px 7px',
            fontSize: '16px'
        },
        '& .MuiFormLabel-root': {
            fontSize: '16px'
        }
    }
}))

const formControlStyle = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(2, 1),
        minWidth: 200
    },
    selectEmpty: {
        margin: theme.spacing(1)
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
    }
}))

function LoginForm(props) {

    const paperClasses = paperStyle()
    const formControlClasses = formControlStyle()

    return (
            <Paper className={paperClasses.root}>
                <form onSubmit={props.handleSubmit} className={formControlClasses.loginForm}>
                <Container>
                    <img src={Logo} className="Login-logo" alt="" />
                    <Typography>{LoginHeading}</Typography>
                    </Container>
                    <FormControl className={formControlClasses.formControl}>
                        <TextField type="text"
                            id="email"
                            disabled={props.Auth.loading}
                            error={props.Auth.isError}
                            label={UsernameLabel}
                            size="small"
                            variant="outlined"
                            onChange={props.handleChange} />
                    </FormControl>
                    <FormControl className={formControlClasses.formControl}>
                        <TextField label={PasswordLabel}
                                disabled={props.Auth.loading}
                                error={props.Auth.isError}
                                helperText={props.Auth.errorText}
                                type="password"
                                id="password"
                                size="small"
                                variant="outlined"
                                onChange={props.handleChange} />
                    </FormControl>
                <Container>
                    <Button type="submit" variant="contained" color="primary">{LoginButtonLabel}</Button>
                    </Container>
                </form>
            </Paper>
    )
}

const mapStateToProps = (store) => {
    return {
        Auth: store.authentication
    }
}

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            userCredentials: {
                email: '',
                password: ''
            }
        }
    }

    handleChange = (e) => {
        const value = e.target.value
        if(value.length <= LoginInputChatacterLimit){
            this.setState({ userCredentials: { ...this.state.userCredentials, [e.target.id]: value } })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const userCredentials = this.state.userCredentials
        if(userCredentials.email.length <= 0 || userCredentials.password.length <= 0){
            this.props.dispatch(setToastData({
                type: ToastMessageTypes.error,
                message: FailedToLoginEnterCredentialsMessage
            }))
        }
        this.props.dispatch(userLogin(userCredentials))
    }

    componentDidUpdate(newProps){
        if(this.props.Auth.isAuthenticated){
           this.redirectToDashboard()
        }
    }

    componentDidMount(){
        var userInfo = JSON.parse(localStorage.getItem(LocalStorageKeyId))
        if( userInfo ){
            const token = userInfo.token;
            this.props.dispatch(userLogin({token}))
        }
    }

    redirectToDashboard(){
        console.log("User authenticated and redirecting to dashboard")
        this.props.history.push("/dashboard")
    }

    render() {
        return (
            <Container style={
                {
                    height: '100%',
                }
                }>
                <LoginForm handleSubmit={this.handleSubmit} 
                    handleChange={this.handleChange} 
                    {...this.props}/>
            </Container>
        )
    }
}

export default connect(mapStateToProps)(Login)