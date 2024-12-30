import { client } from "../config/db.js";

const tableName = 'engagement_metrics';

export const EngagementModel = {
    async ensureTableExists() {
        const query = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
                id UUID PRIMARY KEY,
                type TEXT,
                views INT,
                likes INT,
                comments INT,
                shares INT
            );
        `;
        try {
            await client.execute(query);
            console.log(`Table '${tableName}' exists or has been created.`);
        } catch (error) {
            console.error('Error ensuring table exists:', error);
            throw error;
        }
    },

    async insert(data) {
        const query = `
            INSERT INTO ${tableName} (id, type, views, likes, comments, shares)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const params = [data.id, data.type, data.views, data.likes, data.comments, data.shares];
        try {
            await client.execute(query, params, { prepare: true });
            console.log('Data inserted successfully');
        } catch (error) {
            console.error('Error inserting data:', error);
            throw error;
        }
    },

    async insertMany(dataArray) {
        const queries = dataArray.map(data => ({
            query: `
                INSERT INTO ${tableName} (id, type, views, likes, comments, shares)
                VALUES (?, ?, ?, ?, ?, ?);
            `,
            params: [data.id, data.type, data.views, data.likes, data.comments, data.shares],
        }));
        try {
            await client.batch(queries, { prepare: true });
            console.log('Multiple rows inserted successfully');
        } catch (error) {
            console.error('Error inserting multiple rows:', error);
            throw error;
        }
    },

    async findAll() {
        const query = `SELECT * FROM ${tableName};`;
        try {
            const result = await client.execute(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    async findById(id) {
        const query = `SELECT * FROM ${tableName} WHERE id = ?;`;
        try {
            const result = await client.execute(query, [id], { prepare: true });
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching data by ID:', error);
            throw error;
        }
    },

    async deleteById(id) {
        const query = `DELETE FROM ${tableName} WHERE id = ?;`;
        try {
            await client.execute(query, [id], { prepare: true });
            console.log('Row deleted successfully');
        } catch (error) {
            console.error('Error deleting row:', error);
            throw error;
        }
    },

    async updateById(id, updates) {
        const query = `
            UPDATE ${tableName}
            SET type = ?, views = ?, likes = ?, comments = ?, shares = ?
            WHERE id = ?;
        `;
        const params = [
            updates.type,
            updates.views,
            updates.likes,
            updates.comments,
            updates.shares,
            id,
        ];
        try {
            await client.execute(query, params, { prepare: true });
            console.log('Row updated successfully');
        } catch (error) {
            console.error('Error updating row:', error);
            throw error;
        }
    },
};
