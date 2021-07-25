//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Properties;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Collect.Models
{
    [XmlRoot(ElementName = "ModbusTagDataType")]
    public partial class ModbusTagDataType
    {
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

        public ModbusTagDataType(int index)
        {
            TypeIndex = index;
        }

        public ModbusTagDataType()
        {
        }

        public static List<ModbusTagDataType> List()
        {
            List<ModbusTagDataType> RegisterList = new List<ModbusTagDataType>();
            RegisterList.Add(new ModbusTagDataType(ModbusTagDataType.ModInteger16));
            RegisterList.Add(new ModbusTagDataType(ModbusTagDataType.ModInteger32));
            RegisterList.Add(new ModbusTagDataType(ModbusTagDataType.ModFloat));
            RegisterList.Add(new ModbusTagDataType(ModbusTagDataType.ModSwappedFloat));
            RegisterList.Add(new ModbusTagDataType(ModbusTagDataType.ModDouble));
            RegisterList.Add(new ModbusTagDataType(ModbusTagDataType.ModSwappedDouble));
            RegisterList.Add(new ModbusTagDataType(ModbusTagDataType.ModBool));
            return RegisterList;
        }

        public void GetDisplayName()
        {
            try
            {
                string resourceName = $"DataType_{GetBrowseName(TypeIndex)}";

                DisplayName = Resources.ResourceManager.GetString(resourceName);
            }
            catch { throw; }
        }

        /// <summary>
        /// Returns the browse name for the attribute.
        /// </summary>
        public static string GetBrowseName(int identifier)
        {
            try
            {
                FieldInfo[] fields = typeof(ModbusTagDataType).GetFields(BindingFlags.Public | BindingFlags.Static);

                foreach (FieldInfo field in fields)
                {
                    if (identifier == (int)field.GetValue(typeof(ModbusTagDataType)))
                    {
                        return field.Name;
                    }
                }

                return System.String.Empty;
            }
            catch { throw; }
        }

        /// <summary>
        /// Returns the number of Registers needed for the current datatype. 1 Modbus register is 2 bytes.
        /// </summary>
        public int GetRegCount()
        {
            try
            {
                return sizeTable[typeIndex];
            }
            catch { throw; }
        }


    }
}
