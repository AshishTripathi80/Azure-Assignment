// Import necessary modules
const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configuration for Azure SQL Database using environment variables
const config = {
    user: process.env.DB_USER, // Your database username
    password: process.env.DB_PASSWORD, // Your database password
    server: process.env.DB_SERVER, // Your database host
    database: process.env.DB_NAME, // Your database name
    options: {
        encrypt: true, // Azure requires encryption
        enableArithAbort: true
    }
};

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle JSON responses
app.use(express.json());

// Connect to the database and set up routes
sql.connect(config)
    .then(pool => {
        console.log("Connected to the database!");

        // Route to fetch users
        app.get('/users', async (req, res) => {
            try {
                const result = await pool.request().query('SELECT * FROM Users');
                res.json(result.recordset);
            } catch (err) {
                console.error('Error fetching users:', err);
                res.status(500).send('Error fetching users');
            }
        });

        // Add more routes as needed
        // e.g., app.post('/users', ...);

    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit the application if the connection fails
    });

// Start the application
app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
