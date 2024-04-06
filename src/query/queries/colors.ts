// Author: Yentl Hendrickx
// Updated: 2023-10-22
// Description: All color based queries

import { Pool, QueryResult } from "pg";
import { Request, Response } from "express";

module.exports = (pool: Pool) => {
  // Get all colors
  const getColors = (request: Request, response: Response) => {
    pool.query(`SELECT * FROM colors ORDER BY id DESC`, (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };

  const deleteColor = (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id);
    pool.query(`DELETE FROM colors WHERE id = $1`, [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Color deleted with ID: ${id}`);
    });
  };

  const addColor = async (request: Request, response: Response) => {
    try {
      const results: QueryResult<any> = await new Promise((resolve, reject) => {
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
    deleteColor,
  };
};
