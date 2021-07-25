//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using NLog;
using System;
using System.Resources;

namespace Collect.Models
{
    public class ResourceManagerWrapper
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        public ResourceManagerWrapper(ResourceManager resourceManager)
        {
            this.res = resourceManager;
        }

        private void doMinDefense()
        {
            if (res == null)
                throw new ArgumentException("Resource must be set");
        }

        public ResourceManager res { get; set; }

        public string GetOrDefault(string key)
        {
            #region Defensive Prog

            doMinDefense();

            #endregion Defensive Prog

            if (!string.IsNullOrEmpty(res.GetString(key)))
                return res.GetString(key).Trim();
            logger.Warn("Resource value for key: \"{0}\" not found in resource file", key);
            return "---";
        }
    }
}
