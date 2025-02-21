require("dotenv").config();
const mysql = require("mysql2/promise");

// 📌 Conectar usando DATABASE_URL de Railway
const pool = mysql.createPool(process.env.DATABASE_URL);

module.exports = pool;
