const pool = require('../db'); // Adjust the path to your DB config
const bcrypt = require('bcrypt');

// Find user by email
const userByGmail = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0]; // Return first user or undefined
    } catch (error) {
        throw new Error('Error fetching user by email');
    }
};

// Compare input password and hashed password
const comparePass = async (password, hashedPass) => {
    return await bcrypt.compare(password, hashedPass);
};

// Create a new user
const createUser = async (name, email, hashPassword) => {
    try {
        const result = await pool.query(
            `INSERT INTO users (name, email, password) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [name, email, hashPassword] 
        );
        return result.rows[0];
    } catch (error) {
        throw new Error('Error creating user');
    }
};

// 🔹 Export all
module.exports = {
    userByGmail,
    comparePass,
    createUser,
};
