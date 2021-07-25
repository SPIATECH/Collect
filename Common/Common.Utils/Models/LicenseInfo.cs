//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Utils.Models
{
    /// <summary>
    ///       
    /// </summary>
    public class LicenseInfo
    {
        public LicenseInfo()
        {

        }

        // This is the most important field
        // Always check this field first. If donglestatus == "notfound", then all other fields
        // in this class is undefined & invalid. 
        public string donglestatus { get; set; }
        public string validity { get; set; }

        public int createdon { get; set; }
        public string status { get; set; }
        public string type { get; set; }
        public int maxtags { get; set; }
        public bool IsTagsExceeded { get; set; }
        public string subscription_validity { get; set; }
        public string subscription_status { get; set; }
        public int subscription_validupto { get; set; }
        public string[] datasource_protocols { get; set; }

        // Important value for the reciever. Denotes if we are Normal, Grace Period Or Blocked
        public int State { get; set; }
        public int PrevState { get; set; }
        public int gracePeriodRemainingSeconds;
        public bool GracePeriodEnteredInPast;
        public bool BlockedStateEnteredInPast;
        public string ErrorMessage { get; set; }

    }
}
