//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Collect.Models
{
    /// <summary>
    /// This is a class useful for dealing with dll
    /// Configuration.
    /// See, https://stackoverflow.com/a/41993955
    /// </summary>
    public class ConfigMan
    {
        #region Memberes

        private string _assemblyLocation;
        private Configuration _configuration;

        #endregion Memberes

        #region Constructors

        /// <summary>
        /// Loads config file settings for libraries that use assembly.dll.config files
        /// </summary>
        /// <param name="assemblyLocation">The full path or UNC location of the loaded file that contains the manifest. A common way of
        /// getting this information is like this 'this.GetType().Assembly.Location' </param>
        public ConfigMan(string assemblyLocation)
        {
            _assemblyLocation = assemblyLocation;
        }

        #endregion Constructors

        #region Properties

        private Configuration Configuration
        {
            get
            {
                if (_configuration == null)
                {
                    try
                    {
                        _configuration = ConfigurationManager.OpenExeConfiguration(_assemblyLocation);
                    }
                    catch (Exception exception)
                    {
                        NLog.LogManager.GetCurrentClassLogger().Error("Error opening configuration" + exception);
                    }
                }
                return _configuration;
            }
        }

        #endregion Properties

        #region Methods

        public string GetAppSetting(string key)
        {
            string result = string.Empty;
            if (Configuration != null)
            {
                KeyValueConfigurationElement keyValueConfigurationElement = Configuration.AppSettings.Settings[key];
                if (keyValueConfigurationElement != null)
                {
                    string value = keyValueConfigurationElement.Value;
                    if (!string.IsNullOrEmpty(value)) result = value;
                }
            }
            return result;
        }

        #endregion Methods
    }
}
