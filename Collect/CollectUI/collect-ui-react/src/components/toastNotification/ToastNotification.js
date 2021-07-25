//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Grow from '@material-ui/core/Grow'
import MuiAlert from '@material-ui/lab/Alert';
import { connect, useDispatch } from 'react-redux'
import { clearData } from '../../redux'
import { ToastNotificationAutohideDuration, ToastMessageTypes } from '../../common/GlobalConstants'

const mapStateToProps = (store) => {
    return {
        data: store.toastMessage.data
    }
}

function Transition(props) {
    return <Grow {...props} />
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ToastNotification(props) {

    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(clearData())
    }

    if (props.data) {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                open={true}
                TransitionComponent={Transition}
                autoHideDuration={props.data.type === ToastMessageTypes.error ? null : ToastNotificationAutohideDuration }
                onClose={handleClose}
            >
                <Alert
                    severity={props.data.type}
                    onClose={handleClose}
                >
                    {props.data.message}
                </Alert>
            </ Snackbar>
        )
    }
    else {
        return null
    }
}

export default connect(mapStateToProps)(ToastNotification)