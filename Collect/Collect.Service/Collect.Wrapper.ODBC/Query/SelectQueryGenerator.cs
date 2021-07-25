//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Collect.Service.ODBC.Query
{
    public class SelectQueryGeneratorODBC
    {
        private readonly List<string> _columns;

        /// <summary>
        /// This is some thing like "tagId = 26", "_date > 'Last Read'"
        /// This might change to deal each part of the condition separately
        /// </summary>
        private readonly List<string> _whereConditionsAnds;

        private readonly List<string> _whereConditionsOrs;

        private readonly string _tableName;

        public SelectQueryGeneratorODBC(string[] columns, string tableName, string[] whereConditionsAnds, string[] whereConditionsOrs)
        {
            _columns = columns.ToList();
            _whereConditionsAnds = whereConditionsAnds.ToList();
            _whereConditionsOrs = whereConditionsOrs.ToList();
            _tableName = tableName;
        }

        public string BuildQuery()
        {
            string columns = string.Join(",", _columns.ToArray());
            string whereconditions = string.Join(" OR ", _whereConditionsOrs);
            string qry = $@"select {columns}
from {_tableName}
where {whereconditions}
";
            return qry;
        }
    }
}
