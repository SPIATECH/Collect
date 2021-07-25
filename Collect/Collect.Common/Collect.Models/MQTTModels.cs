//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Xml.Serialization;

namespace Collect.Models
{
    [XmlRoot(ElementName = "Tag")]
    public class CollectTag
    {
        [XmlAttribute]
        public Guid TagId { get; set; }

        [XmlAttribute]
        public Guid GroupId { get; set; }

        [XmlAttribute]
        public string TagName { get; set; }

        [XmlAttribute]
        public string ParentFullName { get; set; }

        [XmlAttribute]
        public string CreateTimeStamp { get; set; }
    }

    [XmlRoot(ElementName = "Group")]
    public class CollectGroup
    {
        [XmlAttribute]
        public Guid GroupId { get; set; }

        [XmlAttribute]
        public Guid ParentGroupId { get; set; }

        [XmlAttribute]
        public string GroupName { get; set; }

        [XmlAttribute]
        public string ParentFullName { get; set; }

        [XmlAttribute]
        public string CreateTimeStamp { get; set; }

        [XmlArray(ElementName = "Groups")]
        [XmlArrayItem(ElementName = "Group")]
        public ObservableCollection<CollectGroup> SubGroups { get; set; }

        [XmlArray(ElementName = "Tags")]
        [XmlArrayItem(ElementName = "Tag")]
        public ObservableCollection<CollectTag> Tags { get; set; }

        public CollectGroup()
        {
            SubGroups = new ObservableCollection<CollectGroup>();
            Tags = new ObservableCollection<CollectTag>();
        }
    }

    [XmlRoot(ElementName = "CollectGroup")]
    public class CollectGroupCollection
    {
        [XmlArray(ElementName = "Groups")]
        [XmlArrayItem(ElementName = "Group")]
        public List<CollectGroup> Groups { get; set; }
    }

    [XmlRoot(ElementName = "ActiveBinding")]
    public class ActiveSerializerValues
    {
        [XmlElement]
        public int ClientId { get; set; }

        [XmlElement]
        public ActiveSerializerBinding Binding { get; set; }

        [XmlArray(ElementName = "tags")]
        [XmlArrayItem(ElementName = "tag")]
        public List<ActiveSerializerTag> tags { get; set; }
    }

    [XmlRoot(ElementName = "Binding")]
    public class ActiveSerializerBinding
    {
        [XmlAttribute(AttributeName = "Id")]
        public int BindingId { get; set; }

        [XmlAttribute]
        public string function { get; set; }

        [XmlAttribute]
        public string period { get; set; }
    }

    [XmlRoot(ElementName = "tag")]
    public class ActiveSerializerTag
    {
        [XmlAttribute(AttributeName = "id")]
        public int TagId { get; set; }

        [XmlArray(ElementName = "Values")]
        [XmlArrayItem(ElementName = "Value")]
        public List<ActiveSerializerValue> ValueList { get; set; }
    }

    [XmlRoot(ElementName = "Value")]
    public class ActiveSerializerValue
    {
        [XmlAttribute]
        public double value { get; set; }

        [XmlAttribute]
        public DateTime timestamp { get; set; }
    }
}
