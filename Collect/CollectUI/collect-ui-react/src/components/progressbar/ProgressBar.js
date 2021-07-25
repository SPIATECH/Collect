//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ImportDialog from '@material-ui/core/Dialog';
import ImportContent  from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { connect, useDispatch } from 'react-redux'
import { clearData } from '../../redux'

const mapStateToProps = (store) => {
    return {
        progress: store.progressBar.progress
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      textAlign:'center',
      minWidth:500,
      '& > * + *': {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(6),
      },
    },
}));

function ProgressBar(props) {
    console.log('***********Progress**************');
console.log(props.progress);

    const [impDialogOpen, setImpDialogOpen] = React.useState(false);
    const dispatch = useDispatch()
    const classes = useStyles();

    const handleClose = () => {
        dispatch(clearData())
    }

    if (props.progress) {
        setImpDialogOpen(props.progress.event)
        return (
            <ImportDialog 
                className="alert-select-modal" 
                aria-labelledby='customized-dialog-title' 
                maxWidth='md' 
                open={impDialogOpen} 
                size='medium' >
                <ImportContent>
                    <div className={classes.root}>
                        <Typography variant="h6" gutterBottom>
                            {props.progress.message}
                        </Typography>
                        <LinearProgress />
                    </div>
                </ImportContent>
            </ImportDialog>
        )
    }
    else {
        return null
    }
}

export default connect(mapStateToProps)(ProgressBar)