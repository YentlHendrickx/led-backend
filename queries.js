const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'haze',
    host: 'localhost',
    database: 'project_led',
    password: 'haze',
    port: 5432,
});

// MQTT
const mqtt = require('./mqtt');

const testMQTT = (request, response) => {
    response.status(200).json(mqtt.UpdateClients('testTopic', 'send'));
}

// Devices
const getDevices = (request, response) => {
    pool.query('SELECT * FROM "Devices" ORDER BY last_seen DESC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const getDeviceById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM "Devices" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const getDeviceByMacAddress = (request, response) => {
    const mac_address = request.params.mac_address;
    pool.query('SELECT * FROM "Devices" WHERE mac_address = $1', [mac_address], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

// EFFECTS
const getEffects = (request, response) => {
    pool.query('SELECT * FROM "Effects" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

// Endpoint for pinging the server, to update the last_seen timestamp and or create a new device
const pingServer = (request, response) => {
    const { name, ip_address, mac_address, led_count } = request.body;

    console.log(request.body);

    // Check if the mac address already exists in the database
    pool.query('SELECT * FROM "Devices" WHERE mac_address = $1', [mac_address], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length > 0) {
            // update the last_seen timestamp
            const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Brussels' });
            pool.query('UPDATE "Devices" SET last_seen = $1 WHERE mac_address = $2', [timestamp, mac_address], (error, newresult) => { 
                if (error) {
                    throw error;
                }

                response.status(200).json(`Updated the timestamp of device with ID: ${results.rows[0].id}`);
            });

        } else {
            // If the mac address doesn't exist, create the device
            const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Brussels' });
            
            pool.query('INSERT INTO "Devices" (name, ip_address, mac_address, led_count, first_seen, last_seen) VALUES ($1, $2, $3, $4, $5, $6)', 
            [name, ip_address, mac_address, led_count, timestamp, timestamp], (error, newresult) => {
                if (error) {
                    throw error;
                }
                response.status(201).json(`Device added with ID: ${newresult.id}`);
            });
        }
    });
}

// Get effect info for device
const getEffectByDevices = (request, response) => {
    pool.query(`
    SELECT d.id AS device_id, d.name AS device_name, 
    e.name AS effect_name, c.name AS color_name, c.rgb_value AS color_value,
    STRING_AGG(p.name || ': ' || pv.value, ', ') AS parameters
        FROM public."Devices" d
        JOIN public."DeviceEffects" de ON d.id = de.device_id
        JOIN public."Effects" e ON de.effect_id = e.id
        JOIN public."Colors" c ON de.color_id = c.id
        JOIN public."EffectParameters" ep ON e.id = ep.effect_id
        JOIN public."Parameters" p ON ep.parameter_id = p.id
        JOIN public."ParameterValues" pv ON ep.id = pv.effect_parameter_id
        GROUP BY d.id, d.name, e.name, c.name, c.rgb_value;
    `, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

// Get effect info for device by id
const getEffectByDeviceId = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(`
    SELECT e.name AS effect_name, c.name AS color_name, c.rgb_value AS color_value,
    STRING_AGG(p.name || ': ' || pv.value, ', ') AS parameters
        FROM public."Devices" d
        JOIN public."DeviceEffects" de ON d.id = de.device_id
        JOIN public."Effects" e ON de.effect_id = e.id
        JOIN public."Colors" c ON de.color_id = c.id
        JOIN public."EffectParameters" ep ON e.id = ep.effect_id
        JOIN public."Parameters" p ON ep.parameter_id = p.id
        JOIN public."ParameterValues" pv ON ep.id = pv.effect_parameter_id
        WHERE d.id = $1
        GROUP BY e.name, c.name, c.rgb_value;
    `, [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

// Export the functions
module.exports = {
    // Devices
    getDevices,
    getDeviceById,
    getDeviceByMacAddress,

    // Effects
    getEffects,
    getEffectByDevices,
    getEffectByDeviceId,
    
    // Utilities
    pingServer,
    testMQTT,
}