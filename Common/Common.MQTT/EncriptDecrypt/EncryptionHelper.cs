//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using NLog;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Common.Mqtt.Cryptography
{
    /// <summary>
    /// To encrypt authentication details of AuthenticationViewModel
    /// </summary>
    public static class EncryptionHelper
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        #region RjindaelAlgorithmKeyAndIv

        private static byte[] rijKey;
        private static byte[] rijIv;

        #endregion RjindaelAlgorithmKeyAndIv

        #region Constructor

        static EncryptionHelper()
        {
            Rijndael rijndael = Rijndael.Create();
            Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionHelperConstants.RjindaelPassWord, EncryptionHelperConstants.SALT);
            rijKey = pdb.GetBytes(EncryptionHelperConstants.KeySize);
            rijIv = pdb.GetBytes(EncryptionHelperConstants.IvSize);
        }

        #endregion Constructor

        #region Encryption

        /// <summary>
        /// To encrypt authentication details of AuthenticationViewModel
        /// </summary>
        /// <param name="authCredentials">AuthenticationModel</param>
        /// <returns></returns>
        public static byte[] EncrptMessage(string message)
        {
            try
            {
                // Encrypt the string to an array of bytes.
                byte[] encrypted = EncryptXmlToBytes(message);
                return encrypted;
            }
            catch (Exception e)
            {
                logger.Error(e.Message, "Encrypt Authentication Credentilas failed");
                return new byte[0];
            }
        }

        /// <summary>
        /// To Encrypt xml data to byte[]
        /// </summary>
        /// <param name="credentials_xml">auth credentials in xml format</param>
        /// <returns></returns>
        private static byte[] EncryptXmlToBytes(string credentials_xml)
        {
            if (credentials_xml == null || credentials_xml.Length <= 0)
                throw new ArgumentNullException(EncryptionHelperConstants.ArgumentNull);

            try
            {
                byte[] encrypted;
                // Create an Rijndael object
                // with the specified key and IV.
                using (Rijndael rijAlg = Rijndael.Create())
                {
                    // Create an encryptor to perform the stream transform.
                    ICryptoTransform encryptor = rijAlg.CreateEncryptor(rijKey, rijIv);

                    // Create the streams used for encryption.
                    using (MemoryStream msEncrypt = new MemoryStream())
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                            {
                                ////Write all data to the stream.
                                swEncrypt.Write(credentials_xml);
                            }
                            encrypted = msEncrypt.ToArray();
                        }
                    }
                }
                // Return the encrypted bytes from the memory stream.
                return encrypted;
            }
            catch (Exception exc)
            {
                logger.Error(exc.Message, "EncryptXmlToBytes failed");
                return new byte[0];
            }
        }

        #endregion Encryption

        public static string CalculateChecksum(byte[] data)
        {
            string result = null;
            try
            {
                SHA256 hash = SHA256.Create();
                byte[] bytes = hash.ComputeHash(data);

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                result = builder.ToString();
            }
            catch (Exception ex)
            {
                logger.Error($"failed : {ex.Message}");
            }

            return result;
        }
    }
}