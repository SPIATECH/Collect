//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using NLog;
using System;
using System.IO;

namespace Common.Utils
{
    /// <summary>
    /// This class facilitates the general actions on the directory
    /// </summary>
    public class FileOperationsHelper
    {
        public static Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Copy folders from source to destination including the fils.
        /// </summary>
        /// <param name="sourceDirName">Source directory from where files are copied.</param>
        /// <param name="destDirName">Destination directory from where files are copied.</param>
        /// <param name="copySubDirs">Boolean variable to whether copy subdirectory needed or not. If true, subdirectory will be copied.</param>
        public static void CopyDirectory(string sourceDirName, string destDirName, bool copySubDirs)
        {
            try
            {
                logger.Trace("Directory Copy started");
                logger.Debug($"Source Directory: {sourceDirName}");
                logger.Debug($"Destination Directory: {destDirName}");
                // Get the subdirectories for the specified directory.
                DirectoryInfo dir = new DirectoryInfo(sourceDirName);

                // If the destination directory doesn't exist, create it.
                if (!Directory.Exists(destDirName))
                {
                    Directory.CreateDirectory(destDirName);
                    logger.Debug($"Directory Created for Copying {destDirName}");
                }
                else
                {
                    logger.Debug("Directory already exists");
                }

                // Get the files in the directory and copy them to the new location.
                FileInfo[] files = dir.GetFiles();
                foreach (FileInfo file in files)
                {
                    //Not copy the files wich has the extention -Workbench.xaml
                    if (!file.Name.EndsWith("-Workbench.xaml"))
                    {
                        file.CopyTo(Path.Combine(destDirName, file.Name), false);
                    }
                }

                // If copying subdirectories, copy them and their contents to new location.
                if (copySubDirs)
                {
                    foreach (DirectoryInfo subdir in dir.GetDirectories())
                    {
                        CopyDirectory(subdir.FullName, Path.Combine(destDirName, subdir.Name), copySubDirs);
                    }
                }
                logger.Trace("Directory Copy ended");
            }
            catch (Exception ex)
            {
                logger.Error($" failed {ex}");
            }
        }

        /// <summary>
        /// To remove the directory at the specified location
        /// </summary>
        /// <param name="directoryPath">path of the directory location</param>
        public static void DeleteDirectory(string directoryPath)
        {
            try
            {
                logger.Debug($"Delete directory started. Directory path is {directoryPath}");

                DirectoryInfo directory = new DirectoryInfo(directoryPath);
                logger.Debug($"Temp Path is {directoryPath}");

                // Checking whether the directory is existing or not.
                if (directory.Exists)
                {
                    logger.Debug($"Directory exists at {directoryPath}");
                    directory.Delete(true);
                    logger.Debug($"Directory {directory.Name} deleted successfully");
                }
                else
                {
                    logger.Debug($"No directory exists in the location {directoryPath}");
                }
            }
            catch (Exception ex)
            {
                logger.Error($" failed {ex}");
            }
        }

        public static byte[] ConvertFileToByteArray(string directoryPath)
        {
            try
            {
                logger.Debug(" started");
                return File.ReadAllBytes(directoryPath);
            }
            catch (Exception ex)
            {
                logger.Debug($" failed {ex}");
                return null;
            }
        }
    }
}