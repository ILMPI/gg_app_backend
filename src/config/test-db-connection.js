require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Promisify the pool
const db = pool.promise();

// Function to test the database connection
const testConnection = async () => {
    try {
        // Execute a simple query
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('Database connection successful:', rows[0].solution); // Should output: 2
    } catch (error) {
        console.error('Database connection failed:', error.message);
    } finally {
        // Close the pool
        pool.end();
    }
};

// Run the test
testConnection();
