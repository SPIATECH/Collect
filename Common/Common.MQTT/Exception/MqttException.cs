//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Mqtt
{
    /// <summary>
    /// This is a custom exeption class.
    /// This is invocked from mqtt Wrapper class when exception occurs in mqtt communication
    /// </summary>
    public class MqttException : Exception
    {
        public MqttException(string message, Exception inner) : base(message, inner)
        {

        }
        /* Below Overloads are Suggested by Roslynator.It is a good Practice incase of custom Exeptions 
        to overload all the base class constructors,whether it is not used.*/
        public MqttException() : base()
        {
        }
        //It is indended to future aspects
        public MqttException(string message) : base(message)
        {
        }

       

        protected MqttException(System.Runtime.Serialization.SerializationInfo info, System.Runtime.Serialization.StreamingContext context) : base(info, context)
        {
        }
    }
}
