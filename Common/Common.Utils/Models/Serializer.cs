//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml.Serialization;
using Newtonsoft.Json;
using NLog;

namespace Common.Utils.Models
{
    public class Serializer
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        protected Serializer()
        {
        }

        public static string XmlSerializer<T>(T tag, Encoding encoding = null)
        {
            string serialized = string.Empty;
            try
            {
                logger.Debug($"start");
                if (encoding == null)
                    encoding = Encoding.UTF8;
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    StringBuilder xmlBuilder = new StringBuilder();
                    using (StreamWriter streamWriter = new StreamWriter(memoryStream, encoding))
                    {
                        XmlSerializer serializer = new XmlSerializer(tag.GetType());
                        serializer.Serialize(streamWriter, tag);

                        using (StreamReader streamReader = new StreamReader(memoryStream, encoding))
                        {
                            memoryStream.Position = 0;
                            xmlBuilder.Append(streamReader.ReadToEnd());
                            serialized = xmlBuilder.ToString();
                            xmlBuilder = null;
                            return serialized;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} {1}", "Serializer failed ", ex);
                serialized = null;
            }
            return null;
        }

        public static T XmlDeserializer<T>(string xmlData)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(xmlData)))
                {
                    using (StreamReader streamReader = new StreamReader(ms, Encoding.UTF8, false))
                    {
                        XmlSerializer serializer = new XmlSerializer(typeof(T));
                        T tag = (T)serializer.Deserialize(streamReader);
                        return tag;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} {1}", "Deserializer failed ", ex);
                return default(T);
            }
        }

        public static string JsonSerializer(Object jsonData)
        {
            return JsonConvert.SerializeObject(jsonData, Formatting.Indented);
        }

        public static T JsonDeserializer<T>(string jsonData)
        {
            return JsonConvert.DeserializeObject<T>(jsonData);
        }
    }
}