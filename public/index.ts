// Author: Yentl Hendrickx
// Updated: 2023-10-22
// Description: NodeJS server for Project LED

// Include .env
require("dotenv").config();

// Setup express and dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port: string = process.env.SERVER_PORT ?? "3000";
console.log(process.env.SERVER_PORT);
const db = require("../src/query/query_helper");
const mqtt = require("../src/mqtt/mqtt_wrapper");

// Start express app
const app = express();

// Setup cors and parser
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

// GET ENDPOINTS
// Devices
app.get("/devices", db.getDevices);
app.get("/devices/id/:id", db.getDeviceById);
app.get("/devices/mac/:mac_address", db.getDeviceByMacAddress);

app.post("/device_effects/:id", (req: any, res: any) => {
  db.updateDeviceEffectsById(req, res);
  mqtt.SendMessage("led_control", "update");
});

// Colors
app.get("/colors", db.getColors);
app.delete("/colors/:id", db.deleteColor);
app.post("/colors", db.addColor);

// Effects
app.get("/effects", db.getEffects);
app.get("/effects/info", db.getAllDevicesAndEffects);
app.get("/effects/info/:id", db.getEffectByDeviceId);

// Utils
app.get("/ping", db.pingServer);

app.post("/testMQTT", (req: any, res: any) => {
  console.log("Sending message");
  mqtt.SendMessage("led_control", "update");
  res.status(200).send("Received");
});
