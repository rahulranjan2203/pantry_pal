-- Database Creation
CREATE DATABASE IF NOT EXISTS pantry_pal_db;
USE pantry_pal_db;

-- Items Table
CREATE TABLE IF NOT EXISTS Items (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    expiryDate DATE NOT NULL,
    userId INTEGER NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
