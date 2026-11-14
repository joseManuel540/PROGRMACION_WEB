import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "tienda",
  decimalNumbers: true, // DECIMAL llega como número (80000) y no como texto ("80000.00")
});