// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: Wrapper for MQTT client to publish messages to broker

// Load environment variables
require('dotenv').config();

const mqtt = require('mqtt');

// Read from .env
const protocol = process.env.MQTT_PROTOCOL;
const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;

const clientId = 'mqttjs_' + Math.random().toString(16).slice(3);
const connectUrl = `${protocol}://${host}:${port}`;

// For reconnecting and dropping connection 
let client = null;
let timer = null;

// Time in minutes before breaking connection
const connectionBreak = 5;

function SendMessage(topic, message) {
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

function Publish(topic, message) {
    client.publish(topic, message, { qos: 2, retain: true }, (error) => {
        if (error) {
            return('Error publishing message!');
        }
    });
}

module.exports = {
    UpdateClients,
}
