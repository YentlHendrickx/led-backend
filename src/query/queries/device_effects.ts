// Author: Yentl Hendrickx
// Updated: 2024-04-06
// Description: All effect based queries

import { Request, Response } from "express";
import { Pool } from "pg";

module.exports = (pool: Pool) => {
  // Change device effect by id
  const updateDeviceEffectsById = (request: Request, response: Response) => {
    const effect_id: number = parseInt(request.body.effect_id);
    const device_id: number = parseInt(request.body.device_id);
    const color_id: number = parseInt(request.body.color_id);

    // get the id from the :id parameter
    const id: number = parseInt(request.params.id);

    console.log("effect_id: ", effect_id);

    const query = `
            UPDATE "device_effects"
            SET active = false
            WHERE id = $1
            RETURNING *
        `;
    const searchId = [id];
    pool.query(query, searchId, (error, results) => {
      console.log(results);
      if (error) {
        console.log(error);
        response.status(500).json(error);
      }
    });

    // Look for existing device effect
    const getDeviceEffect = `
            SELECT * FROM "device_effects"
            WHERE device_id = $1 AND effect_id = $2
        `;

    console.log("device_id: ", device_id);
    console.log("device_id: ", effect_id);

    const getQuery = [device_id, effect_id];
    pool.query(getDeviceEffect, getQuery, (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).json(error);
      }

      // Check if device effect exists
      if (results.rows && results.rows.length > 0) {
        // Update existing device effect
        const updateQuery = `
                    UPDATE "device_effects"
                    SET active = true, color_id = $3
                    WHERE device_id = $1 AND effect_id = $2
                    RETURNING *
                `;
        const updateValues = [device_id, effect_id, color_id];
        pool.query(updateQuery, updateValues, (error, results) => {
          if (error) {
            console.log(error);
            response.status(500).json(error);
          }

          response.status(200).json(results.rows[0]);
        });
      } else {
        // Create new device effect
        const query4 = `
                    INSERT INTO "device_effects" (device_id, effect_id, color_id, active)
                    VALUES ($1, $2, $3, true)
                    RETURNING *
                `;
        const values = [device_id, effect_id, color_id];
        pool.query(query4, values, (error, results) => {
          if (error) {
            response.status(500).json(error);
          }

          response.status(200).json(results.rows[0]);
        });
      }
    });
  };

  return {
    updateDeviceEffectsById,
  };
};
