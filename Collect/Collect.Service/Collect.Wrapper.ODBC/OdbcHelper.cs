//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using NLog;
using System;
using System.Configuration;
using System.Data;
using System.Data.Odbc;

namespace Collect.DataAccess.RDBMS
{
    public class OdbcHelper : IDisposable
    {
        // Internal members
        protected string _connString = null;

        protected OdbcConnection _conn = null;
        protected OdbcTransaction _trans = null;
        protected bool _disposed = false;
        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Sets or returns the connection string use by all instances of this class.
        /// </summary>
        public static string ConnectionString { get; set; }

        /// <summary>
        /// Returns the current OdbcTransaction object or null if no transaction
        /// is in effect.
        /// </summary>
        public OdbcTransaction Transaction { get { return _trans; } }

        /// <summary>
        /// Constructor using global connection string.
        /// </summary>
        public OdbcHelper()
        {
            try
            {
                ConnectionString = ConfigurationManager.ConnectionStrings["Config"].ConnectionString;
                _connString = ConnectionString;
                Connect();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Error in OdbcHelper Constructor");
            }
        }

        /// <summary>
        /// Constructure using connection string override
        /// </summary>
        /// <param name="connString">Connection string for this instance</param>
        public OdbcHelper(string connString, bool isDsn = false)
        {
            if (isDsn)
                _connString = $"DSN={connString}";
            else
                _connString = connString;
            Connect();
        }

        // Creates a OdbcConnection using the current connection string
        protected void Connect()
        {
            _conn = new OdbcConnection();
            _conn.ConnectionString = _connString;
            _conn.Open();
        }

        /// <summary>
        /// Constructs a OdbcCommand with the given parameters. This method is normally called
        /// from the other methods and not called directly. But here it is if you need access
        /// to it.
        /// </summary>
        /// <param name="qry">SQL query or stored procedure name</param>
        /// <param name="type">Type of SQL command</param>
        /// <param name="args">Query arguments. Arguments should be in pairs where one is the
        /// name of the parameter and the second is the value. The very last argument can
        /// optionally be a OdbcParameter object for specifying a custom argument type</param>
        /// <returns></returns>
        public OdbcCommand CreateCommand(string spName, CommandType type, params object[] args)
        {
            OdbcCommand cmd = new OdbcCommand(spName, _conn);

            // Associate with current transaction, if any
            if (_trans != null)
                cmd.Transaction = _trans;

            // Set command type
            cmd.CommandType = type;

            // Construct SQL parameters
            for (int i = 0; i < args.Length; i++)
            {
                var argument = args[i] as OdbcParameter;
                if (args[i] is string && i < (args.Length - 1))
                {
                    OdbcParameter parm = new OdbcParameter();
                    string parmName = (string)args[i];
                    parm.ParameterName = parmName;
                    parm.Value = args[++i];
                    cmd.Parameters.Add(parm);
                }
                else if (argument != null)
                {
                    cmd.Parameters.Add((OdbcParameter)args[i]);
                }
                else throw new ArgumentException("Invalid number or type of arguments supplied");
            }
            return cmd;
        }

        #region Exec Members

        /// <summary>
        /// Executes a query that returns no results
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>The number of rows affected</returns>
        public int ExecNonQuery(string qry, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                return cmd.ExecuteNonQuery();
            }
        }

        /// <summary>
        /// Executes a stored procedure that returns no results
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>The number of rows affected</returns>
        public int ExecNonQueryProc(string proc, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(proc, CommandType.StoredProcedure, args))
            {
                return cmd.ExecuteNonQuery();
            }
        }

        /// <summary>
        /// Executes a query and returns the returnedId as an int
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="qry">Query text</param>
        /// <param name="returnParameterName">Variable used in sql stored procedure for taking output. Symbol @ is appended inside this method if not present in this.</param>
        /// <returns>Results as int</returns>
        public int ExecNonQueryProcReturnInsertedId(string proc, string returnParameterName = "@InsertedId", params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(proc, CommandType.StoredProcedure, args))
            {
                int returnId = -1;

                OdbcParameter parm = new OdbcParameter();
                parm.ParameterName = returnParameterName;
                parm.OdbcType = OdbcType.BigInt;
                parm.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(parm);

                cmd.ExecuteNonQuery();

                var valueReturned = cmd.Parameters[returnParameterName].Value;
                if (valueReturned != null)
                    int.TryParse(valueReturned.ToString(), out returnId);

                return returnId;
            }
        }

        /// <summary>
        /// Executes a query that returns a single value
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Value of first column and first row of the results</returns>
        public object ExecScalar(string qry, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                return cmd.ExecuteScalar();
            }
        }

        /// <summary>
        /// Executes a query that returns a single value
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Value of first column and first row of the results</returns>
        public object ExecScalarProc(string qry, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(qry, CommandType.StoredProcedure, args))
            {
                return cmd.ExecuteScalar();
            }
        }

        /// <summary>
        /// Executes a query and returns the results as a OdbcDataReader
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a OdbcDataReader</returns>
        public OdbcDataReader ExecDataReader(string qry, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                return cmd.ExecuteReader();
            }
        }

        /// <summary>
        /// Executes a stored procedure and returns the results as a OdbcDataReader
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a OdbcDataReader</returns>
        public OdbcDataReader ExecDataReaderProc(string qry, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(qry, CommandType.StoredProcedure, args))
            {
                return cmd.ExecuteReader();
            }
        }

        /// <summary>
        /// Executes a query and returns the results as a DataSet
        /// </summary>
        /// <param name="qry">Query text</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a DataSet</returns>
        public DataSet ExecDataSet(string qry, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(qry, CommandType.Text, args))
            {
                OdbcDataAdapter adapt = new OdbcDataAdapter(cmd);
                DataSet ds = new DataSet();
                adapt.Fill(ds);
                return ds;
            }
        }

        /// <summary>
        /// Executes a stored procedure and returns the results as a Data Set
        /// </summary>
        /// <param name="proc">Name of stored proceduret</param>
        /// <param name="args">Any number of parameter name/value pairs and/or SQLParameter arguments</param>
        /// <returns>Results as a DataSet</returns>
        public DataSet ExecDataSetProc(string qry, params object[] args)
        {
            using (OdbcCommand cmd = CreateCommand(qry, CommandType.StoredProcedure, args))
            {
                OdbcDataAdapter adapt = new OdbcDataAdapter(cmd);
                DataSet ds = new DataSet();
                adapt.Fill(ds);
                return ds;
            }
        }

        #endregion Exec Members

        #region Transaction Members

        /// <summary>
        /// Begins a transaction
        /// </summary>
        /// <returns>The new OdbcTransaction object</returns>
        public OdbcTransaction BeginTransaction()
        {
            Rollback();
            _trans = _conn.BeginTransaction();
            return Transaction;
        }

        /// <summary>
        /// Commits any transaction in effect.
        /// </summary>
        public void Commit()
        {
            if (_trans != null)
            {
                _trans.Commit();
                _trans = null;
            }
        }

        /// <summary>
        /// Rolls back any transaction in effect.
        /// </summary>
        public void Rollback()
        {
            if (_trans != null)
            {
                _trans.Rollback();
                _trans = null;
            }
        }

        #endregion Transaction Members

        #region IDisposable Members

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                // Need to dispose managed resources if being called manually
                if (disposing && _conn != null)
                {
                    Rollback();
                    _conn.Dispose();
                    _conn = null;
                }
                _disposed = true;
            }
        }

        #endregion IDisposable Members
    }
}
