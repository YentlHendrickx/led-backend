const mqtt = require('mqtt');
const protocol = 'http';
const host = '192.168.199.250';
const port = 1883;
const clientId = 'mqttjs_' + Math.random().toString(16).slice(3);
const connectUrl = `${protocol}://${host}:${port}`;

let client = null;
let timer = null;

// Time in minutes before breaking connection
const connectionBreak = 5;

function UpdateClients(topic, message) {
    Connect();

    if (client.connected) {
        Publish(topic, message);
        ResetTimer();
    } else {
        client.on('connect', () => {
            UpdateClients(topic, message);
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
