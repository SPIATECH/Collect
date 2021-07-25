//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using NLog;
using System;
using System.Timers;
using System.Diagnostics;

namespace Common.Utils.Timers
{
    /// <summary>
    /// A timer with higher accuracey. Say around 1ms.
    /// </summary>
    public class AccurateTimer
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        #region Public API

        /// <summary>
        /// This action will be called when timer's Tick is Elapsed. It should be after creating
        /// instance of this class.
        /// </summary>
        public Action Elapsed { get; set; }

        /// <summary>
        /// interval of the timer. Interval in milliseconds.
        /// </summary>
        public uint IntervalInMilliSeconds
        {
            get
            {
                return (uint)Timer.Interval;
            }
            set
            {
                Timer.Interval = value;
            }
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="timeInMilliseconds">Time in milliseconds. If you need 1 second, 1000 (ie. 1 * 1000) should be passed.</param>
        public AccurateTimer(uint timeInMilliseconds, Action Elapsed)
        {
            Timer = new System.Timers.Timer(timeInMilliseconds);
            IntervalInMilliSeconds = timeInMilliseconds;
            this.Elapsed = Elapsed;
            Timer.Elapsed += MutlimediaTimer_Tick_handler;
        }

        /// <summary>
        /// Start the Timer
        /// </summary>
        public void Start()
        {
            Debug.Assert(Timer != null, "Timer field not initialized.");
            Debug.Assert(IntervalInMilliSeconds != 0, "IntervalInMilliSeconds shouldn't be zero.");
            Timer.Start();
            logger.Debug($"Timer started. IntervalInMilliSeconds={IntervalInMilliSeconds}");
        }

        /// <summary>
        /// Stop the Timer
        /// </summary>
        public void Stop()
        {
            Debug.Assert(Timer != null, "Timer field not initialized.");
            Timer.Stop();
            logger.Debug($"Timer stopped. IntervalInMilliSeconds={IntervalInMilliSeconds}");
        }

        #endregion Public API

        #region Current Implementation

        //
        // We choose MultimediaTimer after researching about various high-performance counters.
        //
        // 1. MicroTimer
        // http://web.archive.org/web/20110828091624/http://www.codeproject.com:80/KB/dotnet/MicroTimer.aspx
        // 2. QueryPerformanceCounter based Timer
        // https://www.codeproject.com/Articles/2635/High-Performance-Timer-in-C
        // 3. MultimediaTimer
        // http://web.archive.org/web/20110916055714/http://www.softwareinteractions.com:80/blog/2009/12/7/using-the-multimedia-timer-from-c.html
        // We chose MultimediaTimer since it's having low resource utilization and having performance we need (1ms).

        private System.Timers.Timer Timer { get; set; }

        /// <summary>
        /// Event handler to call Elapsed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void MutlimediaTimer_Tick_handler(object sender, ElapsedEventArgs e)
        {
            try
            {
                if (Elapsed == null) logger.Error("Elapsed Action not set");
                else Elapsed();
                logger.Debug($"Timer tick elapsed. IntervalInMilliSeconds={IntervalInMilliSeconds}");
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

        #endregion Current Implementation
    }
}
