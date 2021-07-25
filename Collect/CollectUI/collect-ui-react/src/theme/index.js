//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

///////////////////////////////////////////////////////////////
/// Creating and exporting basic theme for whole application //
/// globally Which can be accessed from any components.      //

import { createMuiTheme } from '@material-ui/core/styles'
import { enUS, ruRU } from "../locale";

const languages = {
    'enUS': enUS,
    'ruRU': ruRU
}

class LocalTheme{

    createTheme(){
        console.log("Getting localstorage data")
        const localUserConfig = JSON.parse(localStorage.getItem('collectUserInfo'))
        let userLanguage = languages['enUS']
        if(localUserConfig){
            userLanguage = languages[localUserConfig.language] ? languages[localUserConfig.language] : languages['enUS']
        }
        console.log(userLanguage.props.HeaderTexts.alertsHeaderDescription)
        return createMuiTheme({ }, userLanguage) 
    }

}
export default new LocalTheme()