// src/lib/db.js
import mysql from 'mysql2/promise';

let pool;

async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: 'localhost',
      user: 'todo',
      password: 'todo',
      database: 'todo',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

export async function query(q, values) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(q, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}