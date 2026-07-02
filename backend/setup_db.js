// backend/setup_db.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const sequelize = require('./database');
const Item = require('./models/Item');
const User = require('./models/User'); // Registered User model for sync

async function setup() {
    console.log('Starting Database Setup...');

    // 1. Create Database if it doesn't exist
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database '${process.env.DB_NAME}' checked/created.`);
        await connection.end();
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }

    // 2. Sync Sequelize Models
    try {
        await sequelize.authenticate();
        console.log('Sequelize connected to database.');

        // Sync models (creates tables)
        await sequelize.sync({ force: true }); // force: true drops and recreates tables
        console.log('Database synced (Tables recreated).');

    } catch (err) {
        console.error('Sequelize sync error:', err);
        process.exit(1);
    }

    // 3. Verify with a test query
    try {
        const userCount = await User.count();
        const itemCount = await Item.count();
        console.log(`Current User count: ${userCount}`);
        console.log(`Current Item count: ${itemCount}`);
        console.log('Database setup complete. Ready for user registration and login.');

    } catch (err) {
        console.error('Verification error:', err);
    }

    console.log('Setup Complete.');
    process.exit(0);
}

setup();
