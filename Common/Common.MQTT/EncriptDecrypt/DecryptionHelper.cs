//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using NLog;
using System;
using System.Diagnostics;
using System.IO;
using System.Security.Cryptography;

namespace Common.Mqtt.Cryptography
{
    /// <summary>
    /// To decrypt the authentication detals
    /// </summary>
    public class DecryptionHelper
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        #region RjindaelAlgorithmKeyAndIv

        private static readonly byte[] RjindaelKey;
        private static readonly byte[] RjindaelIv;

        #endregion RjindaelAlgorithmKeyAndIv

        #region Constructor

        static DecryptionHelper()
        {
            Rijndael rijndael = Rijndael.Create();
            Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionHelperConstants.RjindaelPassWord, EncryptionHelperConstants.SALT);
            RjindaelKey = pdb.GetBytes(EncryptionHelperConstants.KeySize);
            RjindaelIv = pdb.GetBytes(EncryptionHelperConstants.IvSize);
        }

        #endregion Constructor

        #region Decryption

        /// <summary>
        /// Initialize decryption of authentication details obtained from mqtt
        /// </summary>
        /// <param name="subscribedCredentials">Subscibed data from mqtt</param>
        /// <returns></returns>
        public static string DecryptMessage(byte[] message)
        {
            try
            {
                logger.Trace("Decrypt Auth Credentials started");

                string originalString = DecryptStringFromBytes(message);
                return originalString;
            }
            catch (Exception exc)
            {
                logger.Error(exc.Message, "Decrypt Auth Credentials failed");
                return string.Empty;
            }
        }

        /// <summary>
        /// To decrypt byte array to string
        /// </summary>
        /// <param name="credentialsAsByteArray">subscribed auth credentials from mqtt</param>
        /// <returns></returns>
        private static string DecryptStringFromBytes(byte[] credentialsAsByteArray)
        {
            try
            {
                Debug.Assert(credentialsAsByteArray.Length > 0);
                // Declare the string used to hold
                // the decrypted text.
                string decryptedString = null;
                logger.Trace("DecryptStringFromBytes started");
                logger.Debug($"credentialsAsByteArray length = {credentialsAsByteArray.Length}");
                // Create an Rijndael object
                // with the specified key and IV.
                using (Rijndael rijAlg = Rijndael.Create())
                {
                    logger.Debug($"Key length = {RjindaelKey.Length} and Iv length = {RjindaelIv.Length}");
                    // Create a decryptor to perform the stream transform.
                    ICryptoTransform decryptor = rijAlg.CreateDecryptor(RjindaelKey, RjindaelIv);

                    // Create the streams used for decryption.
                    using (MemoryStream msDecrypt = new MemoryStream(credentialsAsByteArray))
                    {
                        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                            {
                                // Read the decrypted bytes from the decrypting stream
                                // and place them in a string.
                                decryptedString = srDecrypt.ReadToEnd();
                            }
                        }
                    }
                    return decryptedString;
                }
            }
            catch (Exception exc)
            {
                logger.Error(exc.Message, "DecryptStringFromBytes failed");
                return string.Empty;
            }
        }

        #endregion Decryption
    }
}

