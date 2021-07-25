//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react' 
import { withStyles } from '@material-ui/core/styles';
import Header from '../header/Header'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import StyledTreeView from './StyledTreeView'
import { GroupsListHeading } from '../../common/GlobalConstants';

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
            minHeight: '81vh',
        }
    });
};

class Groups extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { classes  } = this.props;
        console.log(this.props.collectGroup)
        return (
            <div style={{height:"100%"}}>
                <Header title={this.props.title}  description={this.props.description}/>
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <StyledTreeView />
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default (withStyles(formStyle)(Groups))
