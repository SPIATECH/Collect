//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react'
import Header from '../header/Header'
import DataSourceItems from './DataSourceItems'
import './DataSourceManager.scss'

function DataSourceManager(props){
    return(
        <div style={{height:"100%"}}>
            <Header title={props.title}  description={props.description}/>
            <div className="tabContentarea">
                <DataSourceItems />
            </div>
        </div>
    )
 }

 export default DataSourceManager