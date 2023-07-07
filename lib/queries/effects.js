// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: All effect based queries

module.exports = (pool) => {
    // Effects
    const getEffects = (request, response) => {
        pool.query('SELECT * FROM "Effects" ORDER BY id ASC', (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    }

    // Get all devices and effects
    const getAllDevicesAndEffects = (request, response) => {
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

    return {
        getEffects,
        getAllDevicesAndEffects,
        getEffectByDeviceId
    }
};