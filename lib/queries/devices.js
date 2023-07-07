// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: All device based queries

module.exports = (pool) => {
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

    return {
        getDevices,
        getDeviceById,
        getDeviceByMacAddress
    }
};