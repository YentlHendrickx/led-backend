// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: All color based queries

module.exports = (pool) => {
    // Get all colors
    const getColors = (request, response) => {
        pool.query('SELECT * FROM "Colors" ORDER BY id DESC', (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    }

    return {
        getColors
    };
};