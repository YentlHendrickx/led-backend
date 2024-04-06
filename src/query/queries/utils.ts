// Author: Yentl Hendrickx
// Updated: 2023-10-22
// Description: All utility based queries

import { Pool } from "pg";
import { Request, Response } from "express";

module.exports = (pool: Pool) => {
  // Endpoint for pinging the server, to update the last_seen timestamp and or create a new device
  const pingServer = (request: Request, response: Response) => {
    const { name, ip_address, mac_address, led_count } = request.body;

    console.log(request.body);

    // Check if the mac address already exists in the database
    pool.query(
      'SELECT * FROM "devices" WHERE mac_address = $1',
      [mac_address],
      (error, results) => {
        if (error) {
          throw error;
        }
        const timestamp: string = new Date().toUTCString();
        if (results.rows.length > 0) {
          pool.query(
            'UPDATE "devices" SET name = $1, last_seen = $2 WHERE mac_address = $3',
            [name, timestamp, mac_address],
            (error, newresult) => {
              if (error) {
                throw error;
              }

              // Return json with 'device_id' and 'timestamp'
              response.status(200).json({
                device_id: results.rows[0].id,
                timestamp: timestamp,
              });
            }
          );
        } else {
          pool.query(
            'INSERT INTO "devices" (name, ip, mac_address, led_count, first_seen, last_seen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, ip_address, mac_address, led_count, timestamp, timestamp],
            (error, newresult) => {
              if (error) {
                throw error;
              }

              // Return json with 'device_id' and 'timestamp'
              response.status(200).json({
                device_id: newresult.rows[0].id,
                timestamp: timestamp,
              });
            }
          );
        }
      }
    );
  };

  return {
    pingServer,
  };
};
