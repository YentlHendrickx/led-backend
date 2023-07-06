const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const db = require('./queries');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

app.get('/testMQTT', db.testMQTT);

// Devices
app.get('/devices', db.getDevices);
app.get('/devices/id/:id', db.getDeviceById);
app.get('/devices/ping/', db.pingServer);
app.get('/devices/mac/:mac_address', db.getDeviceByMacAddress);

// Effects
app.get('/devices/effects/info/', db.getEffectByDevices);
app.get('/devices/effects/info/:id', db.getEffectByDeviceId);

// Effects
app.get('/effects', db.getEffects);