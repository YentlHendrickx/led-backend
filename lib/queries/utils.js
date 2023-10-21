// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: All utility based queries

module.exports = (pool) => {
    // Endpoint for pinging the server, to update the last_seen timestamp and or create a new device
    const pingServer = (request, response) => {
        const { name, ip_address, mac_address, led_count } = request.body;

        console.log(request.body);

        // Check if the mac address already exists in the database
        pool.query('SELECT * FROM "devices" WHERE mac_address = $1', [mac_address], (error, results) => {
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

                    // Return json with 'device_id' and 'timestamp'
                    response.status(200).json({
                        device_id: results.rows[0].id,
                        timestamp: timestamp
                    });
                });

            } else {
                // If the mac address doesn't exist, create the device
                const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Brussels' });
                
                pool.query('INSERT INTO "devices" (name, ip_address, mac_address, led_count, first_seen, last_seen) VALUES ($1, $2, $3, $4, $5, $6)', 
                [name, ip_address, mac_address, led_count, timestamp, timestamp], (error, newresult) => {
                    if (error) {
                        throw error;
                    }

                    // Return json with 'device_id' and 'timestamp'
                    response.status(200).json({
                        device_id: newresult.id,
                        timestamp: timestamp
                    });
                });
            }
        });
    }

    return {
        pingServer
    };
};