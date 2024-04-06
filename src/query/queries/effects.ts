// Author: Yentl Hendrickx
// Updated: 2024-04-06
// Description: All effect based queries

import { Request, Response } from "express";
import { Pool } from "pg";

module.exports = (pool: Pool) => {
  // Effects
  const getEffects = (request: Request, response: Response) => {
    pool.query('SELECT * FROM "effects" ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };

  // Get all devices and effects
  const getAllDevicesAndEffects = (request: Request, response: Response) => {
    console.log("Getting all devices and effects");
    pool.query(
      `
      SELECT 
    d.id AS device_id,
    d.name AS device_name, 
    de.id as device_effect_id,
    e.id AS effect_id,
    e.name AS effect_name,
    c.id AS color_id,
    c.name AS color_name,
    c.rgba_value AS color_value,
    STRING_AGG(p.name::text || ': ' || COALESCE(pv.value::text, ep.default_value::text), ', ') AS parameters
FROM 
    devices d
    JOIN "device_effects" de ON d.id = de.device_id AND de.active = TRUE
    JOIN "effects" e ON de.effect_id = e.id
    LEFT JOIN "colors" c ON de.color_id = c.id
    LEFT JOIN "effect_parameters" ep ON e.id = ep.effect_id
    LEFT JOIN "parameters" p ON ep.parameter_id = p.id
    LEFT JOIN "parameter_values" pv ON ep.id = pv.effect_parameter_id AND pv.device_effect_id = de.id
GROUP BY
    d.id, de.id, d.name, e.name, e.id, c.id
ORDER BY
    d.id, de.id;

        `,
      (error, results) => {
        if (error) {
          console.log("Error in getAllDevicesAndEffects");
          console.log(error);

          // throw error;
          response.status(500).json(error);
        } else {
          response.status(200).json(results.rows);
        }
      }
    );
  };

  // Get effect info for device by id
  const getEffectByDeviceId = (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id);
    pool.query(
      `     SELECT 
    d.id AS device_id,
    d.name AS device_name, 
    de.id as device_effect_id,
    e.id AS effect_id,
    e.name AS effect_name,
    c.id AS color_id,
    c.name AS color_name,
    c.rgba_value AS color_value,
    STRING_AGG(p.name::text || ': ' || COALESCE(pv.value::text, ep.default_value::text), ', ') AS parameters
FROM 
    devices d
    JOIN "device_effects" de ON d.id = de.device_id AND de.active = TRUE
    JOIN "effects" e ON de.effect_id = e.id
    LEFT JOIN "colors" c ON de.color_id = c.id
    LEFT JOIN "effect_parameters" ep ON e.id = ep.effect_id
    LEFT JOIN "parameters" p ON ep.parameter_id = p.id
    LEFT JOIN "parameter_values" pv ON ep.id = pv.effect_parameter_id AND pv.device_effect_id = de.id
WHERE d.id = $1
GROUP BY
    d.id, de.id, d.name, e.name, e.id, c.id
ORDER BY
    d.id, de.id;
       
        `,
      [id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  };

  return {
    getEffects,
    getAllDevicesAndEffects,
    getEffectByDeviceId,
  };
};
