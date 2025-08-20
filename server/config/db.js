const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 6000,
  timeout: 60000,
});

db.getConnection()
  .then((connection) => {
    console.log("Database connected successfully !");
    connection.release();
  })
  .catch((error) => {
    console.log("Connection failed", error.message);
  });

module.exports = db;
