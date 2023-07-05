const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'haze',
    host: 'localhost',
    database: 'project_led',
    password: 'haze',
    port: 5432,
});

// Devices
const getDevices = (request, response) => {
    pool.query('SELECT * FROM devices ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

const getDeviceById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM devices WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

// Get effect info for device
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
    })
}


module.exports = {
    getDevices,
    getDeviceById,
    getEffectByDeviceId,
}