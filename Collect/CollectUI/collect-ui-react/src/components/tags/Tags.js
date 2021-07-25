//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Header from '../header/Header';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './Tags.scss';
import { useTheme } from '@material-ui/core/styles'
import { 
    NoTagsInfoMessage, 
    AlertsTagsTableTagNameColumnHeader, 
    TagListCountperPage, 
    EnterKeyCode
} from '../../common/GlobalConstants';
import { 
    getTag, 
    selectTag, 
    getAlerts, 
    selectFQTagName, 
    removeSelectedTag, 
    selectGroup, 
    getGroupById, 
    removeSelectedTagName
} from '../../redux'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    },
    fullWidthCenter:{
        textAlign: 'center',
        width:'100%'
    }
}));


const mapStateToProps = store => {
    return {
        CollectTag: store.tags.CollectTag,
        SelectedTag: store.tags.selectedTag,
        selectedGroup: store.groups.selectedGroup
    }
}

function Tags(props) {
    const classes = useStyles();
    const theme = useTheme()
    const dispatch = useDispatch()
    const [keyRowSelect, setKeyRowSelect] = React.useState(false);
    const [idRowSelect, setIdRowSelect] = React.useState(false);
    const ref = React.createRef();

    useEffect(() => {
        var queryString = window.location.href;
        var hash =  queryString.split('?');
        var paramItems = {}
        if(hash.length > 1){
            hash[1].split('&').map(hk => { 
            let temp = hk.split('='); 
                paramItems[temp[0]] = temp[1] 
            });

            if (paramItems['group']) {
                dispatch(removeSelectedTagName());
                dispatch(getTag(paramItems['group']));
                dispatch(selectGroup(paramItems['group']));
                dispatch(getGroupById(paramItems['group']));
            } 
        }
       

       
    }, []);

    function onRowSelect(name, id, fullName) {
        dispatch(selectFQTagName(fullName+'.'+name))
        setKeyRowSelect(name)
        dispatch(selectTag(id));
        dispatch(getAlerts(id));
        window.location = window.location.origin+"/#/groups/tags/alerts?tags="+id
    }

    function tagFormatter(cell, row) {
        return <LocalOfferIcon />;
    }

    function nameFormatter(cell, row) {
        return <span className="q-link" onClick={() => onRowSelect(row.name, row.id, row.parentFullName)}>{cell}</span>
    }

    const customStyle = (cell, row) => {
        setKeyRowSelect(row.name)
        setIdRowSelect(row.id)
        return {
            outline:'rgb(19, 137, 220) solid 0px'
        };
    }

    const options = {
        sizePerPageList: [{ text: TagListCountperPage.default, value: TagListCountperPage.default}, {text: TagListCountperPage.option_1, value:TagListCountperPage.option_1}, {text: TagListCountperPage.option_2, value: TagListCountperPage.option_2}],
        sizePerPage: TagListCountperPage.default, 
        defaultSortName: 'name',  
        defaultSortOrder: 'asc' 
    } 

   
    const handleTagSearch = (e) => {
     
        if(e.charCode == EnterKeyCode){
            var cValue = e.target.value
            ref.current.applyFilter(cValue);
        }
    }

    const bypassSortingAction = (e) => {
        console.log(e);
        e.stopPropagation();  
    }

    const keyBoardNavProp = {
        customStyle: customStyle
    }

    if (props.CollectTag != undefined && props.CollectTag.length > 0) {
        return (
            <div style={{height:"100%"}}>
                <Header title={props.title}  description={props.description}/>
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <div className="section-tags">
                                
                                <BootstrapTable data={props.CollectTag} options={options}  bordered={false} pagination hover keyBoardNav={keyBoardNavProp} cleanSelected>
                                    <TableHeaderColumn headerTitle={ false } dataField='id' dataFormat={tagFormatter}></TableHeaderColumn>
                                    <TableHeaderColumn ref={ref} headerTitle={ false } dataField='name' dataFormat={nameFormatter} filter={{type:'TextFilter'}} isKey={true} dataSort>
                                        {AlertsTagsTableTagNameColumnHeader} 
                                        <div>
                                        <OutlinedInput onKeyPress={handleTagSearch}  onClick={bypassSortingAction} id="standard-password-input" className="filter-control" />
                                        </div>
                                    </TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
    }
    else {
        dispatch(removeSelectedTag(false));
        return (
            <div style={{height:"100%"}}>
                <Header title={props.title}  description={props.description}/>
                <div className="tabContentarea">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography color="primary"
                                gutterBottom={true}
                                variant="subtitle1">
                                {NoTagsInfoMessage}
                            </Typography>
                        </Paper>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Tags)
