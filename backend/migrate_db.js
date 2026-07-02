// backend/migrate_db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateDatabase() {
    console.log('Starting Database Migration...');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Check if email column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'email'
        `);

        if (columns.length === 0) {
            console.log('Adding email column...');
            
            // First add the column as nullable
            await connection.query(`ALTER TABLE Users ADD COLUMN email VARCHAR(255)`);
            
            // Update existing users with placeholder emails
            const [users] = await connection.query(`SELECT id, username FROM Users WHERE email IS NULL`);
            
            for (const user of users) {
                const placeholderEmail = `${user.username}@placeholder.com`;
                await connection.query(`UPDATE Users SET email = ? WHERE id = ?`, [placeholderEmail, user.id]);
            }
            
            // Now make it NOT NULL and UNIQUE
            await connection.query(`ALTER TABLE Users MODIFY COLUMN email VARCHAR(255) NOT NULL UNIQUE`);
            
            console.log('Email column added successfully');
        } else {
            console.log('Email column already exists');
        }

        await connection.end();
        console.log('Migration completed successfully');
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateDatabase();