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
using NLog;

namespace Collect.Models
{
    public static class CollectSerializer
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public static string Serializer<T>(T tag, Encoding encoding = null)
        {
            MemoryStream memoryStream = null;
            try
            {
                StringBuilder xmlBuilder = new StringBuilder();
                if (encoding == null)
                    encoding = Encoding.UTF8;
                memoryStream = new MemoryStream();

                using (StreamWriter streamWriter = new StreamWriter(memoryStream, encoding))
                {
                    XmlSerializer serializer = new XmlSerializer(tag.GetType());
                    serializer.Serialize(streamWriter, tag);

                    using (StreamReader streamREader = new StreamReader(memoryStream, encoding))
                    {
                        memoryStream.Position = 0;
                        xmlBuilder.Append(streamREader.ReadToEnd());
                    }
                    return xmlBuilder.ToString();
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} {1}", "Serializer failed ", ex);
                return null;
            }
        }

        public static T Deserializer<T>(string xmlData, Encoding encoding = null)
        {
            try
            {
                MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(xmlData));
                if (encoding == null)
                    encoding = Encoding.UTF8;

                using (StreamReader streamReader = new StreamReader(ms, encoding, false))
                {
                    XmlSerializer serializer = new XmlSerializer(typeof(T));
                    T tag = (T)serializer.Deserialize(streamReader);
                    return tag;
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} {1}", "Deserializer failed ", ex);
                return default(T);
            }
        }
    }
}
