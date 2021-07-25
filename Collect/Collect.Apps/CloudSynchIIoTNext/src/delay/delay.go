//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package delay

import "time"

func DelaySecond(n time.Duration) {
	time.Sleep(n * time.Second)
}

func DelayMinute(n time.Duration) {
	time.Sleep(n * time.Minute)
}