//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;

namespace Collect.Service.ODBC
{
    partial class ProjectInstaller
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.serviceCollectOdbcProcessInstaller1 = new System.ServiceProcess.ServiceProcessInstaller();
            this.serviceCollectOdbcInstaller = new System.ServiceProcess.ServiceInstaller();
            // 
            // serviceCollectOdbcProcessInstaller1
            // 
            this.serviceCollectOdbcProcessInstaller1.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.serviceCollectOdbcProcessInstaller1.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.serviceCollectOdbcInstaller});
            this.serviceCollectOdbcProcessInstaller1.Password = null;
            this.serviceCollectOdbcProcessInstaller1.Username = null;
            // 
            // serviceCollectOdbcInstaller
            // 
            this.serviceCollectOdbcInstaller.ServiceName = CollectODBCServiceConstants.TestServiceName;
            this.serviceCollectOdbcInstaller.DisplayName = CollectODBCServiceConstants.TestServiceDisplayName;
            this.serviceCollectOdbcInstaller.Description = CollectODBCServiceConstants.TestServiceDescription;
            this.serviceCollectOdbcInstaller.StartType = System.ServiceProcess.ServiceStartMode.Manual;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.serviceCollectOdbcProcessInstaller1});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller serviceCollectOdbcProcessInstaller1;
        private System.ServiceProcess.ServiceInstaller serviceCollectOdbcInstaller;
    }
}