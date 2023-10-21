// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: All effect based queries

module.exports = (pool) => {
    // Effects
    const getEffects = (request, response) => {
        pool.query('SELECT * FROM "effects" ORDER BY id ASC', (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    }

    // Get all devices and effects
    const getAllDevicesAndEffects = (request, response) => {
        pool.query(`
            SELECT 
                d.id AS device_id,
                d.name AS device_name, 
                e.name AS effect_name,
                c.name AS color_name,
                c.rgba_value AS color_value,
                STRING_AGG(p.name::text || ': ' || pv.value::text, ', ') AS parameters
            FROM 
                devices d
                JOIN "device_effects" de ON d.id = de.device_id
                JOIN "effects" e ON de.effect_id = e.id
                JOIN "colors" c ON de.color_id = c.id
                JOIN "effect_parameters" ep ON e.id = ep.effect_id
                JOIN "parameters" p ON ep.parameter_id = p.id
                JOIN "parameter_values" pv ON ep.id = pv.effect_parameter_id
            GROUP BY
                d.id, d.name, e.name, c.name, c.rgba_value;
        `, (error, results) => {
            if (error) {
                console.log("Error in getAllDevicesAndEffects");
                console.log(error);

                // throw error;
                response.status(500).json(error);
            } else {
                response.status(200).json(results.rows);
            }
        });
    }

    // Get effect info for device by id
    const getEffectByDeviceId = (request, response) => {
        const id = parseInt(request.params.id);
        pool.query(`
        SELECT e.name AS effect_name, c.name AS color_name, c.rgba_value AS color_value,
        STRING_AGG(p.name::text || ': ' || pv.value::text, ', ') AS parameters
            FROM "devices" d
            JOIN "device_effects" de ON d.id = de.device_id
            JOIN "effects" e ON de.effect_id = e.id
            JOIN "color" c ON de.color_id = c.id
            JOIN "effect_parameters" ep ON e.id = ep.effect_id
            JOIN "parameters" p ON ep.parameter_id = p.id
            JOIN "parameter_values" pv ON ep.id = pv.effect_parameter_id
            WHERE d.id = $1
            GROUP BY e.name, c.name, c.rgba_value;
        `, [id], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    }

    return {
        getEffects,
        getAllDevicesAndEffects,
        getEffectByDeviceId
    }
};