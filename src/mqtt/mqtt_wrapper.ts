// Author: Yentl Hendrickx
// Updated: 2023-10-22
// Description: Wrapper for MQTT client to publish messages to broker

import { MqttClient } from "mqtt";
import mqtt from "mqtt";

// Load environment variables
require('dotenv').config();

// const mqtt = require('mqtt');

// Read from .env
const protocol: string = process.env.MQTT_PROTOCOL ?? 'mqtt';
const broker: string = process.env.MQTT_BROKER ?? 'localhost';
const port: string = process.env.MQTT_PORT ?? '1883';

const clientId = 'mqttjs_' + Math.random().toString(16).slice(3);
const connectUrl = `${protocol}://${broker}:${port}`;

// For reconnecting and dropping connection 
let client: MqttClient;
let timer: NodeJS.Timeout;

// Time in minutes before breaking connection
const connectionBreak = 5;

function SendMessage(topic: string, message: string) {
    Connect();

    // If connected send message, otherwise wait for connection and recurse
    if (client.connected) {
        // Public and start connection timer
        Publish(topic, message);
        ResetTimer();
    } else {
        client.on('connect', () => {
            SendMessage(topic, message);
        });
    }
}

function Connect() {
    if (client && client.connected) {
        return;
    }

    client = mqtt.connect(connectUrl, {
        clientId: clientId,
        clean: true,
        reconnectPeriod: 1000,
    });
}

function ResetTimer() {
    if (timer) {    
        clearTimeout(timer);
    }

    timer = setTimeout(() => {
        client.end(false, () => {
            console.log('Disconnected from MQTT broker');
        });
    }, connectionBreak * 60 * 1000);
}

function Publish(topic: string, message: string) {
    client.publish(topic, message, { qos: 2, retain: true }, (error) => {
        if (error) {
            return('Error publishing message!');
        }
    });
}

module.exports = {
    // UpdateClients,
}
