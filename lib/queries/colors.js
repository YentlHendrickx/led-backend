// Author: Yentl Hendrickx
// Created: 2023-07-07
// Description: All color based queries

module.exports = (pool) => {
    // Get all colors
    const getColors = (request, response) => {
        pool.query(`SELECT * FROM colors ORDER BY id DESC`, (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    }
    
    const addColor = async (request, response) => {
        try {
            const results = await new Promise((resolve, reject) => {
                pool.query(
                    `INSERT INTO colors (name, rgba_value) VALUES ($1, $2) RETURNING id`,
                    [request.body.name, request.body.rgba],
                    (error, queryResult) => {
                        if (error) {
                            reject(error); // Reject the Promise on error
                        } else {
                            resolve(queryResult); // Resolve the Promise with the query result
                        }
                    }
                );
            });
    
            const insertedId = results.rows[0].id; // Access the id from queryResult
            response.status(201).send(`Color added with ID: ${insertedId}`);
        } catch (error) {
            console.log(error);
            response.status(500).send(`Error: ${error}`);
        }
    };

    return {
        getColors,
        addColor,
    };
};