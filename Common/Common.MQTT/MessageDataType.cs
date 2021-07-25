//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

namespace Common.Mqtt
{
    public enum MessageDataType
    {
        String,
        Byte,
        Encrypted
    }

    public class MultiPartBegin
    {
        public int MessageTotalSize;
    }

    public class MultiPartEnd
    {
        public string CheckSum;
    }

}
