//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Common.Models;

namespace Collect.Master.Service
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
            this.CollectMasterServiceInstaller1 = new System.ServiceProcess.ServiceProcessInstaller();
            this.CollectMasterServer = new System.ServiceProcess.ServiceInstaller();
            // 
            // CollectMasterServiceInstaller1
            // 
            this.CollectMasterServiceInstaller1.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.CollectMasterServiceInstaller1.Password = null;
            this.CollectMasterServiceInstaller1.Username = null;
            // 
            // CollectMasterServer
            // 
            this.CollectMasterServer.ServiceName = CollectMasterServiceConstants.TestServiceName;
            this.CollectMasterServer.DisplayName = CollectMasterServiceConstants.TestServiceDisplayName;
            this.CollectMasterServer.Description = CollectMasterServiceConstants.TestServiceDescription;
            this.CollectMasterServer.StartType = System.ServiceProcess.ServiceStartMode.Manual;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.CollectMasterServiceInstaller1,
            this.CollectMasterServer});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller CollectMasterServiceInstaller1;
        private System.ServiceProcess.ServiceInstaller CollectMasterServer;
    }
}
