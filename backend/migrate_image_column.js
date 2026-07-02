// backend/migrate_image_column.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function addImageColumn() {
    console.log('Adding imageUrl column to Items table...');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Check if imageUrl column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Items' AND COLUMN_NAME = 'imageUrl'
        `);

        if (columns.length === 0) {
            console.log('Adding imageUrl column...');
            await connection.query(`ALTER TABLE Items ADD COLUMN imageUrl TEXT`);
            console.log('imageUrl column added successfully');
        } else {
            console.log('imageUrl column already exists');
        }

        await connection.end();
        console.log('Migration completed successfully');
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

addImageColumn();