//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component, useEffect } from 'react'
import StyledTreeItem from './StyledTreeItem'
import TreeView from '@material-ui/lab/TreeView'
import FolderIcon from '@material-ui/icons/Folder'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight' 
import { connect, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles';
import { getTag, getNotificationTag, selectGroup, selectTag, removeSelectGroupName } from '../../redux'
import { CollectUnGroupId } from '../../common/GlobalConstants';
// Sate from redux store is  mapped to our component props
// Below will ensure that the component will reciee a prop called CollectGroup
const mapStateToProps = store => {
    return {
        collectGroup: store.groups.collectGroup
    }
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        paddingRight: '30px',
        height: '100%',
    }
})

const getGroup = (groups) => {
    return (
        groups.map((item, key) => {
            return (
                <StyledTreeItem nodeId={item.id}
                    labelText={item.name}
                    labelIcon={FolderIcon}
                    key={item.id}
                    children={getGroup(item.subgroups || [])}
                />

            )
        }))
}



function StyledTreeView (props) {

    const classes = useStyles()
    const dispatch = useDispatch()
    
    function selectGroupNode(e, nodeId) {
        console.log('=============='+nodeId);
        dispatch(getTag(nodeId));
        dispatch(selectGroup(nodeId));
        dispatch(getNotificationTag(nodeId))
        dispatch(selectTag(false));
        window.location = window.location.origin+"/#/groups/tags?group="+nodeId
        e.preventDefault();
    }

    useEffect((e) => {
        //selectGroupNode(e, CollectUnGroupId);
        dispatch(removeSelectGroupName());
        
    }, []);

   // if (props.collectGroup.length > 0) {
        return (
            <TreeView className="root"
                defaultCollapseIcon={<ArrowDropDownIcon />}
                defaultExpandIcon={<ArrowRightIcon />}
                defaultEndIcon={<div style={{ width: 24 }} />}
                children={getGroup(props.collectGroup)}
                onNodeSelect={(e, nodeId) => {selectGroupNode(e, nodeId); }}
            />
        )
   /*  }
    else {
        return (
            <h1>Loading.. .. ..</h1>
        )
    } */
}

export default connect(mapStateToProps)(StyledTreeView)
