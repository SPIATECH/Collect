//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Collect.Models
{
    public class GroupEntryModel
    {
        public static readonly Guid DefaultGroupId = new Guid("11111111-1111-1111-1111-111111111111");

        /// <summary>
        /// Id
        /// </summary>
        public int Id { get; set; }

        public Guid GroupId { get; set; }

        public Guid ParentId { get; set; }

        // This may be empty in WPF, since ObservableCollections are
        // best suited for WPF use, a similar property is used in ViewModel
        public GroupEntryModel Parent { get; set; }

        public string GroupName { get; set; }
        public int HierarchyLevel { get; set; }
        public bool Enabled { get; set; } = true;
        public string Status { get; set; } = CollectCommonConstants.DefaultStatus;
        // This may be empty in WPF, since ObservableCollections are
        // best suited for WPF use, a similar property is used in ViewModel
        public List<TagEntryModel> Tags { get; set; }

        // This may be empty in WPF, since ObservableCollections are
        // best suited for WPF use, a similar property is used in ViewModel
        public List<GroupEntryModel> Groups { get; set; }

        // This may be empty in WPF, since ObservableCollections are
        // best suited for WPF use, a similar property is used in ViewModel

        public IEnumerable<object> Items
        {
            get
            {
                if (Tags != null)
                    foreach (var tag in Tags)
                        yield return tag;
                if (Groups != null)
                    foreach (var group in Groups)
                        yield return group;
            }
        }
    }
}