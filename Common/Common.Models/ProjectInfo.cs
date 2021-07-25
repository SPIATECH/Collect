//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Common.Models
{
    [XmlRoot(ElementName = "Project")]
    public class ProjectInfo
    {
        [XmlElement(ElementName = "ProjectPath")]
        public string Path { get; set; }

        [XmlElement(ElementName = "ProjectName")]
        public string Name { get; set; }

        [XmlElement(ElementName = "TagsUsed")]
        public int TagsUsed { get; set; }
    }
}
