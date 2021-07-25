//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Properties;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Collect.Models
{
    public partial class ModbusRegisterType
    {
        private Logger logger = LogManager.GetCurrentClassLogger();
        public string DisplayName { get; set; }

        private int typeIndex;

        public int TypeIndex
        {
            get
            {
                return typeIndex;
            }
            set
            {
                typeIndex = value;
                GetDisplayName();
            }
        }

        public ModbusRegisterType(int index)
        {
            TypeIndex = index;
        }

        public static List<ModbusRegisterType> List()
        {
            List<ModbusRegisterType> RegisterList = new List<ModbusRegisterType>();
            RegisterList.Add(new ModbusRegisterType(ModbusRegisterType.Coil));
            RegisterList.Add(new ModbusRegisterType(ModbusRegisterType.HoldingRegister));
            RegisterList.Add(new ModbusRegisterType(ModbusRegisterType.InputRegister));
            RegisterList.Add(new ModbusRegisterType(ModbusRegisterType.Input));
            return RegisterList;
        }

        public void GetDisplayName()
        {
            try
            {
                string resourceName = $"RegisterType_{GetBrowseName(TypeIndex)}";

                DisplayName = Resources.ResourceManager.GetString(resourceName);
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

        /// <summary>
        /// Returns the browse name for the attribute.
        /// </summary>
        public static string GetBrowseName(int identifier)
        {
            try
            {
                FieldInfo[] fields = typeof(ModbusRegisterType).GetFields(BindingFlags.Public | BindingFlags.Static);

                foreach (FieldInfo field in fields)
                {
                    if (identifier == (int)field.GetValue(typeof(ModbusRegisterType)))
                    {
                        return field.Name;
                    }
                }

                return System.String.Empty;
            }
            catch { throw; }
        }
    }
}
