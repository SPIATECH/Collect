//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

namespace Common.Models
{
    /// <summary>
    /// Holds the different states a database can have.
    /// </summary>
    public enum DatabaseStatus
    {
        //Database server is up and running.
        CONNECTED,

        //Issue with database or table schema.
        //Server will be running but operations will fail.
        SCHEMA_ISSUE,

        //Database server is down. Service is not running.
        SERVER_UNAVAILABLE
    }
}
