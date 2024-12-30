import cassandra from 'cassandra-driver';
import { ASTRA_DB_CLIENT_ID, ASTRA_DB_SECRET } from '../constant.js';
import { EngagementModel } from '../model/engagementModel.js';
// Path to your Secure Connect Bundle
const secureConnectBundle = 'secure-connect-cassandra-database.zip';

// Create the Cassandra client using the bundle
const client = new cassandra.Client({
    cloud: { secureConnectBundle },
    keyspace: 'social_analytics', // Your keyspace name
    authProvider: new cassandra.auth.PlainTextAuthProvider(
        ASTRA_DB_CLIENT_ID,
        ASTRA_DB_SECRET
    ),
});

async function connectDB() {
    try {
        await client.connect();
        await EngagementModel.ensureTableExists();
        console.log('Connected to Astra DB successfully.');
    } catch (error) {
        console.error('Failed to connect to Astra DB:', error);
        throw error;
    }
}

export { client, connectDB };
