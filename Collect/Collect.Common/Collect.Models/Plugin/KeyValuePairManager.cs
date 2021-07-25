//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System.Collections.Generic;
using System.Linq;
using System.Xml.Serialization;

namespace Collect.Models
{
    [XmlRoot(ElementName = "KeyValuePairManager")]
    public class KeyValuePairManager
    {
        [XmlArray]
        public List<KeyValueItem> Items { get; set; }
        public KeyValuePairManager()
        {
            Items = new List<KeyValueItem>();
        }

        public void SetValue(string key, string value)
        {
            KeyValueItem existingItem = Items.FirstOrDefault(x => x.Key == key);
            if (existingItem == null)
            {
                existingItem = new KeyValueItem { Key = key, Value = value };
                Items.Add(existingItem);
            }
            else
            {
                existingItem.Value = value;
            }
        }

        public string GetValue(string key)
        {
            KeyValueItem exitingItem = Items.FirstOrDefault(x => x.Key == key);
            if (exitingItem == null)
                return null;
            else
                return exitingItem.Value;
        }

        public KeyValuePairManager GetACloneOfThis()
        {
            KeyValuePairManager kvPair = new KeyValuePairManager();
            foreach (var item in Items)
            {
                kvPair.SetValue(item.Key, item.Value);
            }
            return kvPair;
        }
    }
}
