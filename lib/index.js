// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: NodeJS server for Project LED 

// Include .env
require('dotenv').config();

// Setup express and dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.SERVER_PORT;
const db = require('./query_helper');

// Start express app 
const app = express();

// Setup cors and parser
app.use(cors())
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Start server
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});


// GET ENDPOINTS
// Devices
app.get('/devices', db.getDevices);
app.get('/devices/id/:id', db.getDeviceById);
app.get('/devices/mac/:mac_address', db.getDeviceByMacAddress);

// Colors
app.get('/colors', db.getColors);
app.post('/colors', db.addColor);

// Effects
app.get('/effects', db.getEffects);
app.get('/effects/info', db.getAllDevicesAndEffects);
app.get('/effects/info/:id', db.getEffectByDeviceId);

// Utils
app.get('/ping', db.pingServer);