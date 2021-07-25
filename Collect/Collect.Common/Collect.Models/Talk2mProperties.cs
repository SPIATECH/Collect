//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using Flurl;
using NLog;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net;

/// <summary>
/// This is to define all Class related to Talk2m
/// </summary>
namespace Talk2mProperties
{
        public class getewons
        {
            public string id { get; set; }
            public string name { get; set; }
            public List<gettag> tags { get; set; }
        }


        public class ewons
        {
            public static Dictionary<string, object> propertiesObjects = new Dictionary<string, object>
            {
                { "ewons", new ewons() },
                { "getewons", new getewons() },
                { "getewon", new getewon() },
                { "getdata", new getdata() },
                { "syncdata", new syncdata() },
                { "delete", new delete() },
                { "clean", new clean() },
            };
        }

    public class getewon
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class gettag
    {
        public string id { get; set; }
        public string name { get; set; }
        public string dataType { get; set; }
        public string description { get; set; }
        public string value { get; set; }
        public string quality { get; set; }
        public string ewonTagId { get; set; }
    }

    public class getdata
    {
        public string ewonId { get; set; }
        public string tagId { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public bool fullConfig { get; set; }
        public string limit { get; set; }
    }

    public class syncdata
    {
        public string lastTransactionId { get; set; }
        public string createTransaction { get; set; }
    }

    public class delete
    {
        public bool all { get; set; }
        public string transactionId { get; set; }
        public string ewonId { get; set; }
        public string to { get; set; }
    }

    public class clean
    {
        public bool all { get; set; }
        public string ewonId { get; set; }
    }

    public class MyWebClient : WebClient
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        // Enable compression of server response
        protected override WebRequest GetWebRequest(Uri address)
        {
            HttpWebRequest request = (HttpWebRequest)base.GetWebRequest(address);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            return request;
        }

        public string CallApi(string url, string talk2mDevId, string account, string userName, string password, string id = "", string requestType = "")
        {
            var credentials = new NameValueCollection();
            credentials.Add("t2mdevid", talk2mDevId);
            credentials.Add("t2maccount", account);
            credentials.Add("t2musername", userName);
            credentials.Add("t2mpassword", password);
            if (id != "" && requestType == CollectCommonConstants.Talk2MTagRequestType1)
            {
                logger.Info($"Historical Tag Request , sending parameter ewonId as ewonId={id} through request URL");
                //For Historical Tag Request, parameter ewonId should be send as ewonId="740106"
                credentials.Add("ewonId", id);
            }
            else if (id != "" && requestType == CollectCommonConstants.Talk2MTagRequestType2)
            {
                logger.Info($"All Tag Request , sending parameter ewonId as id={id} through request URL");
                //For normal Tag request, parameter ewonId should be send as id="740106"
                credentials.Add("id", id);
            }
            else
            {
                logger.Info("Device Request Type");
            }

            var bytes = UploadValues(url, credentials); // Send credentials in POST body
            return Encoding.GetString(bytes);
        }

        public static string BuildUrl(string verb, object parameters)
        {
            return CollectCommonConstants.talk2mAPIUrl // Uses the Flurl library to easily build up URLs
                .AppendPathSegment(verb)
                .SetQueryParams(parameters);
        }
    }
}
