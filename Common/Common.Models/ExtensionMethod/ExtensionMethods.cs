//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using NLog;
using System;

using System.Diagnostics;

namespace Common.Models
{
    /// <summary>
    /// This is an Extention Method Class.
    /// All the Methods in this class are Extention Methods.
    /// </summary>
    public static class ExtentionMethods
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Methods Convert Normal Datetime (format) to Unixtime in NanoSeconds
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static long DateTimeToUnixTime(this DateTime dateTime)
        {
            Debug.Assert(dateTime != null, "datetime is null");
            logger.ConditionalTrace($"The date time Before Converting to UnixTimeStamp is{dateTime}");

            DateTimeOffset dateTimeOffset = new DateTimeOffset(dateTime);

            return (dateTimeOffset.ToUnixTimeMilliseconds()) * 1000000;
        }

        /// <summary>
        /// Methods Convert Normal Datetime (format) to Unixtime in Seconds
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static long DateTimeToUnixTimeSeconds(this DateTime dateTime)
        {
            Debug.Assert(dateTime != null, "datetime is null");
            logger.ConditionalTrace($"The date time Before Converting to UnixTimeStamp seconds is{dateTime}");

            DateTimeOffset dateTimeOffset = new DateTimeOffset(dateTime);

            return dateTimeOffset.ToUnixTimeSeconds();
        }

        /// <summary>
        /// Method Converts Unixtime in Nanoseconds to Datetime in Local Format
        /// </summary>
        /// <param name="unixtimeinNanoSeconds"></param>
        /// <returns></returns>
        public static DateTime FromUnixToDateTime(this long unixtimeinNanoSeconds)
        {
            Debug.Assert(unixtimeinNanoSeconds != 0, "unixtimeinNanoSeconds is 0");
            try
            {
                logger.ConditionalTrace($"unixtimeinNanoSeconds is {unixtimeinNanoSeconds}");
                var UnixTimeinMilliSeconds = unixtimeinNanoSeconds / 1000000;

                var dateTime = DateTimeOffset.FromUnixTimeMilliseconds(UnixTimeinMilliSeconds);
                return dateTime.DateTime.ToLocalTime();
            }
            catch (Exception ex)

            {
                logger.Error($"unixtime in Nanoseconds is larger than default long size {ex}");
                return default(DateTime);
            }
        }
    }
}