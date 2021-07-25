//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import SwaggerClient from 'swagger-client'
var apphost = window.location.host
const ApiClient = SwaggerClient({url: "http://" + apphost + "/openapi.json" })

console.log(apphost);

export default ApiClient;