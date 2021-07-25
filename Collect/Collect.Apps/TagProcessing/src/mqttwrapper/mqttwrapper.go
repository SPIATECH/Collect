//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package mqttwrapper

import (
	"fmt"
	//"os"
	MQTT "github.com/eclipse/paho.mqtt.golang"
	log "github.com/sirupsen/logrus"
)


var ClientOptions *MQTT.ClientOptions

var IsConnectionClosed = false

var MqttSubscribedTopics []MqttSubscribedInfo

type MqttSubscribedInfo struct {
	Topic       string
	Handler      *MQTT.MessageHandler
}

func MqttClient(broker string, id string, user string, password string, cleansess bool, logger *log.Entry) MQTT.Client{
	ClientOptions := MQTT.NewClientOptions()
	ClientOptions.AddBroker(broker)
	ClientOptions.SetClientID(id)
	ClientOptions.SetUsername(user)
	ClientOptions.SetPassword(password)
	ClientOptions.SetCleanSession(cleansess)
	ClientOptions.SetConnectionLostHandler(connLostHandler)
	//if *store != ":memory:" {
		//Client.SetStore(MQTT.NewFileStore(*store))
	//}
	ClientOptions.SetDefaultPublishHandler(func(client MQTT.Client, msg MQTT.Message) {
        fmt.Println("topic: %s\n", msg.Topic())
	})
	logger.Info("Creating new Mqtt Client")
	client := MQTT.NewClient(ClientOptions)
    if token := client.Connect(); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		logger.Error("Token Error:",token.Error())
		IsConnectionClosed = true
    }else {
		IsConnectionClosed = false
		logger.Info("Mqtt Client created successfully:",id)
	}
	return client
}

func connLostHandler(client MQTT.Client, err error) {

    fmt.Printf("Mqtt Connection lost, reason: %v\n", err)

	//Perform additional action...
	IsConnectionClosed = true
	
}

func MqttClientReconnect(client MQTT.Client, logger *log.Entry){
	fmt.Printf("Mqtt Client Reconnecting...")
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		logger.Error("Token error:", token.Error())
		IsConnectionClosed = true
    } else {
		fmt.Printf("Mqtt Client Reconnected")
		IsConnectionClosed = false
		var count = 0

		for count < len(MqttSubscribedTopics) {
			fmt.Println("Subscribing to topic:",MqttSubscribedTopics[count].Topic)
			logger.Info("Subscribing to topic:",MqttSubscribedTopics[count].Topic)
			MqttSubscribe(client, MqttSubscribedTopics[count].Topic, MqttSubscribedTopics[count].Handler, logger)
			count++
		}
	}
}

func MqttPublish(client MQTT.Client, topic string, qos int, message string){

	fmt.Println("Mqtt Publisher Started")

	fmt.Println("---- doing publish ----")
	token := client.Publish(topic, byte(qos), false, message)
	token.Wait()

	fmt.Println("Mqtt Publisher Disconnected")
}

func MqttSubscribe(client MQTT.Client, topic string, handlerFunction *MQTT.MessageHandler, logger *log.Entry){

	MqttSubscribed := MqttSubscribedInfo{topic, handlerFunction}
	logger.Info("Topic:", topic)
	if !mqttTopicExists(MqttSubscribedTopics, MqttSubscribed){
		fmt.Println("New Subscribe Topic:", topic)
		logger.Info("New Subscribe Topic:", topic)
		MqttSubscribedTopics = append(MqttSubscribedTopics, MqttSubscribed)
	}else{
		fmt.Println("Already Subscribed Topic:", topic)
		logger.Info("Already Subscribed Topic:", topic)
	}
	client.Subscribe(topic, 0, *handlerFunction)
}

func mqttTopicExists(subscribedTopics []MqttSubscribedInfo, item MqttSubscribedInfo) bool {
	
	var count = 0

	for count < len(subscribedTopics) {
		if subscribedTopics[count].Topic == item.Topic && subscribedTopics[count].Handler == item.Handler{
			return true
		}
		count++
	}

	return false
}
