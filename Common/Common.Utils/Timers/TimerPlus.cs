//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using NLog;

public delegate void TimerCallbackDelegate(object sender, ElapsedEventArgs e);

namespace Common.Utils.Timers
{
    // Timer which give remaining time (Time Left). 
    // Reference : https://stackoverflow.com/questions/2278525/system-timers-timer-how-to-get-the-time-remaining-until-elapse
    public class TimerPlus : System.Timers.Timer
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        private DateTime m_dueTime;

        public TimerPlus() : base()
        {
            this.Elapsed += this.ElapsedAction;
        }

        protected new void Dispose()
        {
            this.Elapsed -= this.ElapsedAction;
            base.Dispose();
        }

        public double TimeLeft
        {
            get
            {
                return (this.m_dueTime - DateTime.Now).TotalMilliseconds;
            }
        }

        public int TimeLeftSeconds
        {
            get
            {
                return (int)(this.m_dueTime - DateTime.Now).TotalSeconds;
            }
        }


        public new void Start()
        {
            this.m_dueTime = DateTime.Now.AddMilliseconds(this.Interval);
            base.Start();
        }

        private void ElapsedAction(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (this.AutoReset)
            {
                this.m_dueTime = DateTime.Now.AddMilliseconds(this.Interval);
            }
        }
    }

    /// <summary>
    /// Timer which fires exactly after the given interval
    /// even if there is machine sleep in between. 
    /// Also it has it's own call back function
    /// </summary>

    public class TimerAbsolute : System.Timers.Timer
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        private DateTime m_dueTime;
        private TimerCallbackDelegate callback;
        private int Tick = 1 * 1000;

        public TimerAbsolute(TimerCallbackDelegate cb) : base()
        {
            if (cb == null)
            {
                throw new Exception("Call back is NULL");
            }
            callback = cb;
            this.Elapsed += this.ElapsedAction;
            this.AutoReset = true;
        }

        protected new void Dispose()
        {
            this.Elapsed -= this.ElapsedAction;
            base.Dispose();
        }

        public double TimeLeft
        {
            get
            {
                return (this.m_dueTime - DateTime.Now).TotalMilliseconds;
            }
        }

        public int TimeLeftSeconds
        {
            get
            {
                return (int)(this.m_dueTime - DateTime.Now).TotalSeconds;
            }
        }


        public void Start(double interval)
        {
            if (interval < 10)
            {
                throw new Exception($"Interval ({interval}) is too small");
            }

            DateTime dueTime = DateTime.Now.AddMilliseconds(interval);
            logger.Info($"Due time : ({dueTime}),  Interval ({interval})");

            if (dueTime <= DateTime.Now)
            {
                throw new Exception($"Due time ({dueTime}) should be in future. Interval ({interval})");
            }
            this.m_dueTime = dueTime;

            // Timer tick is 1 second
            this.Interval = Tick;
            base.Start();
        }

        private void ElapsedAction(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (DateTime.Now >= m_dueTime)
            {
                // This means Timer expired
                logger.Info($"Timer Expired, Now = {DateTime.Now}, Due Time = {m_dueTime}. Calling calllback function");
                callback(sender, e);
                base.Stop();
            }
        }
    }
}
