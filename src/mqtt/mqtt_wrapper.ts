// Author: Yentl Hendrickx
// Updated: 2024-04-06
// Description: Wrapper for MQTT client to publish messages to broker

import mqtt, { MqttClient } from "mqtt";
require("dotenv").config();

const protocol: string = process.env.MQTT_PROTOCOL ?? "mqtt";
const broker: string = process.env.MQTT_BROKER ?? "localhost";
const port: string = process.env.MQTT_PORT ?? "1883";

// TODO: Proper client ID
const clientId = "mqttjs_" + Math.random().toString(16).slice(3);
const connectUrl = `${protocol}://${broker}:${port}`;

let client: MqttClient;
let timer: NodeJS.Timeout;

// Time in minutes before breaking connection
const connectionBreak = 5;
let messageQueue: Array<{ topic: string; message: string }> = [];

function SendMessage(topic: string, message: string) {
  if (client && client.connected) {
    console.log("Sending " + message + " to " + topic);
    Publish(topic, message);
    ResetTimer();
  } else {
    console.log("Client not connected, adding to queue");
    messageQueue.push({ topic, message });
    Connect();
  }
}

function Connect() {
  if (client && client.connected) {
    return;
  }

  if (!(client && client.connected)) {
    console.log("Connecting to MQTT broker");
    client = mqtt.connect(connectUrl, {
      clientId: clientId,
      clean: true,
      reconnectPeriod: 1000,
    });
  }

  client.on("connect", () => {
    while (messageQueue.length > 0) {
      const message = messageQueue.shift();
      if (message) {
        Publish(message.topic, message.message);
      }
    }

    ResetTimer();
  });
}

function ResetTimer() {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    client.end(false, () => {
      console.log("Disconnected from MQTT broker");
    });
  }, connectionBreak * 60 * 1000);
}

function Publish(topic: string, message: string) {
  client.publish(topic, message, { qos: 2, retain: true }, (error) => {
    if (error) {
      return "Error publishing message!";
    }
  });
}

module.exports = {
  SendMessage,
  Connect,
};
