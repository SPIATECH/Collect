//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Xml.Serialization;

namespace Common.Models
{

    // States of RT Client (based on license)
    public enum ApplicationState
    {
        // This is Normal running state of Application (License is valid).
        NORMAL,

        // This is DEMO, very similar to NORMAL.
        DEMO,

        // License is NOT Found, Warning messages is shown on UI, but dashboards & reports will continue to work. 
        GRACEPERIOD_DONGLENOTFOUND,


        // License is invalid, Warning messages is shown on UI, but dashboards & reports will continue to work. 
        GRACEPERIOD_INVALID,

        // License is Valid, but Tag Count Exceeded, Warning messages is shown on UI, but dashboards & reports will continue to work. 
        GRACEPERIOD_TAGSEXCEEDED,

        // Grace period is over, Dashboard is not updated with values anymore, Slideshow is stopped etc.
        BLOCKED
    }

    [XmlRoot(ElementName = "License")]
    public class LicenseRequestModel
    {
        [XmlElement(ElementName = "ClientID")]
        public Guid ClientID { get; set; }

        [XmlElement(ElementName = "ClientName")]
        public string ClientName { get; set; }

    }

}
