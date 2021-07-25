//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React from 'react'
import PropTypes from 'prop-types'
import TreeItem from '@material-ui/lab/TreeItem'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import { makeStyles, fade  } from '@material-ui/core/styles'
import { useSpring, animated } from 'react-spring/web.cjs';
import { useDispatch } from 'react-redux'
import { removeTagFromCollectTag,  removeSelectedTag } from '../../redux'

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const treeItemStyle = makeStyles(theme => ({
    root: {
        margin: '5px 0px',
    },
    iconContainer: {
        '& .close': {
            opacity: 0.3,
        },
    },
    group: {
        marginLeft: 12,
        paddingLeft: 12,
        borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center'
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
        textAlign: 'left',
        paddingTop: 3
    },
}))

function StyledTreeItem(props) {

  const classes = treeItemStyle();
  const { labelText, labelIcon : LabelIcon, labelInfo, color, bgColor, ...other } = props
  const dispatch = useDispatch();

  // To clear tag list when switching between alert and notification tab  Story:11468
  dispatch(removeTagFromCollectTag()) 
  dispatch(removeSelectedTag()) 
  
  return(
    <TreeItem   label={
      <div className={classes.labelRoot}>
        <LabelIcon color="inherit" className={classes.labelIcon}/>
        <Typography variant="body2" className={classes.labelText}>
          {labelText}
        </Typography>
        <Typography variant="caption" color="inherit">
          {labelInfo}
        </Typography>
      </div>
    }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
      nodeId={props.nodeId}
      TransitionComponent={TransitionComponent}
    />
  )
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
}

export default StyledTreeItem