//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Common.Models;

namespace Collect.Talk2M.Service
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
            this.CollectTalk2MServiceProcessInstaller1 = new System.ServiceProcess.ServiceProcessInstaller();
            this.CollectTalk2MServer = new System.ServiceProcess.ServiceInstaller();
            // 
            // CollectTalk2MServiceProcessInstaller1
            // 
            this.CollectTalk2MServiceProcessInstaller1.Account = System.ServiceProcess.ServiceAccount.LocalSystem;
            this.CollectTalk2MServiceProcessInstaller1.Password = null;
            this.CollectTalk2MServiceProcessInstaller1.Username = null;
            // 
            // CollectTalk2MServer
            // 
            this.CollectTalk2MServer.Description = CollectCommonConstants.talk2MServerDescription;
            this.CollectTalk2MServer.DisplayName = CollectCommonConstants.talk2MServerDisplayName;
            this.CollectTalk2MServer.ServiceName =CollectCommonConstants.talk2MServerServiceName;
            // 
            // ProjectInstaller
            // 
            this.Installers.AddRange(new System.Configuration.Install.Installer[] {
            this.CollectTalk2MServiceProcessInstaller1,
            this.CollectTalk2MServer});

        }

        #endregion

        private System.ServiceProcess.ServiceProcessInstaller CollectTalk2MServiceProcessInstaller1;
        private System.ServiceProcess.ServiceInstaller CollectTalk2MServer;
    }
}
