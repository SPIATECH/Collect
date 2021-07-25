//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import React, { Component } from 'react'
import CollectLogo from '../../assets/Collect-x_Logo.png'
import TopHeaderBg from '../../assets/WindowTitle.png'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { NavLink as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import './Header.scss'
import { userLogout } from '../../redux'
import { connect } from 'react-redux'

var sectionStyle = {
    backgroundImage: `url(${TopHeaderBg})`,
    backgroundSize: 'cover',
    width: '100%',
    backgroundPosition: 'center'
};

const mapStateToProps = (store) => {
    return {
        alertInfo: store.alertInfo
    }
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }

    handleLogout = () => {
      this.props.dispatch(userLogout())
        setTimeout(function () {
        //to hide leftpane on logout
        window.location.reload(); 
      } .bind(this), 100 );
    }
    
    handleLogCloseMenu = () => {
        this.setState({ anchorEl: null })
    };

    handleLogClickListItem = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    };

    render() {
        return (
            /*  <div  className="headerContainer">
                 <h1 className="header">{this.props.title}</h1>
                 <h3 >{this.props.description}</h3>
             </div> */
            <div className="topHeader" style={sectionStyle}>
                <Link component={RouterLink} to='/dashboard' className="brandLogo">
                    <img src={CollectLogo} className="logo" alt="" />
                </Link>
                <div className="avatar-right">
                    <Avatar aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleLogClickListItem}>
                            <PersonIcon />
                    </Avatar>
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleLogCloseMenu}
                        elevation={0}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                        }}
                    >
                        <MenuItem onClick={this.handleLogout}>
                        <ListItemIcon>
                            <ExitToAppOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Header)