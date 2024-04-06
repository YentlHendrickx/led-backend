// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: Query helper for PostgreSQL database and query functions

// Include .env
require("dotenv").config();

// Imports
const Pool = require("pg").Pool;

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,

  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

  searchPath: "project_led",
});
console.log(pool.options);

// Queries, pass pool as ref
const ColorQueries = require("./queries/colors")(pool);
const DeviceQueries = require("./queries/devices")(pool);
const EffectQueries = require("./queries/effects")(pool);
const UtilQueries = require("./queries/utils")(pool);
const DeviceEffectQueries = require("./queries/device_effects")(pool);

// Export the functions
module.exports = {
  ...ColorQueries,
  ...DeviceQueries,
  ...EffectQueries,
  ...UtilQueries,
  ...DeviceEffectQueries,
};
