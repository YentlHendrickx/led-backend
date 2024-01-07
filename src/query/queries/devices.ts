// Author: Yentl Hendrickx
// Updated: 2023-10-22
// Description: All device based queries

import { Pool } from "pg";
import { Request, Response } from "express";

module.exports = (pool: Pool) => {
    // Devices
    const getDevices = (request: Request, response: Response) => {
        pool.query('SELECT * FROM "devices" ORDER BY last_seen DESC', (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    }

    const getDeviceById = (request: Request, response: Response) => {
        const id: number = parseInt(request.params.id);
        pool.query('SELECT * FROM "devices" WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    }

    const getDeviceByMacAddress = (request: Request, response: Response) => {
        const mac_address: string = request.params.mac_address;
        pool.query('SELECT * FROM "devices" WHERE mac_address = $1', [mac_address], (error, results) => {
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