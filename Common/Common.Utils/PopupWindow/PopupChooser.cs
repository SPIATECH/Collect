//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using Common.Utils.DataType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Utils.PopupWindow
{
    /// <summary>
    /// Error message string
    /// </summary>
    public class PopupChooser : TypeSafeEnum
    {
        public static readonly PopupChooser Fatal = new PopupChooser(1, PopupChooserConstants.Fatal);
        public static readonly PopupChooser Debug = new PopupChooser(2, PopupChooserConstants.Debug);
        public static readonly PopupChooser Error = new PopupChooser(3, PopupChooserConstants.Error);
        public static readonly PopupChooser Info = new PopupChooser(4, PopupChooserConstants.Info);
        public static readonly PopupChooser Trace = new PopupChooser(5, PopupChooserConstants.Trace);
        public static readonly PopupChooser Warning = new PopupChooser(6, PopupChooserConstants.Warning);

        protected PopupChooser(int value, string name) : base(value, name)
        {
        }
    }
}