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


module.exports = {
    getDevices,
    getDeviceById,
}