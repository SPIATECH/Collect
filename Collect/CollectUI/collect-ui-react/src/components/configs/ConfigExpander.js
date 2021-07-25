//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const expansionPanelStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        padding: 5,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        fontWeight: 600,
        color: '#0f1823'
    }
}));

function ConfigExpander(props) {

    const expansionPanelClasses = expansionPanelStyles();

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={expansionPanelClasses.root}>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content">
                    <Typography className={expansionPanelClasses.heading}>{props.title}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    {props.content}
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                    {props.actions}
                </ExpansionPanelActions>
            </ExpansionPanel>
        </div>
    )
}

export default ConfigExpander