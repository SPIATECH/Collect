//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from '../header/Header'
import Group from '../groups/Groups'
import Tags from '../tags/Tags'
import Alerts from '../alerts/Alerts'
import ResizePanel from 'react-resize-panel'
import classnames from 'classnames/bind'
import ResizePanelStyle from '../resizePanel/ResizePanel.scss'
import './AlertsManager.scss'
import { TagsListHeading, AlertsListHeading } from '../../common/GlobalConstants';

let cx = classnames.bind(ResizePanelStyle)

const mapStateToProps = store => {
    return {
        SelectedTag: store.tags.selectedTag,
    }
}

class AlertsManager extends Component{

     render(){
        return(
            <div style={{height:"auto"}}>
                <Header title={this.props.title} description={this.props.description}/>
                <div className="tabContentarea">
                    <div className={cx('sidebar', 'panel','treeViewContainer')}>
                        <Group/>
                    </div>
                        
                </div>
            </div>
        )
     } 
 }

 export default connect(mapStateToProps)(AlertsManager)