/**
 * MySQL Database Connection Helper
 * Connects to the existing MySQL database for data migration
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export interface MySQLConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export async function connectToMySQL(): Promise<mysql.Connection> {
  const config: MySQLConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE || 'sakhi',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  };

  console.log(`Connecting to MySQL database: ${config.host}:${config.port}/${config.database}`);

  try {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      multipleStatements: true,
    });

    console.log('✅ Successfully connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error);
    throw error;
  }
}

export async function testMySQLConnection(): Promise<void> {
  try {
    const connection = await connectToMySQL();

    // Test the connection by running a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ MySQL connection test successful:', rows);

    await connection.end();
  } catch (error) {
    console.error('❌ MySQL connection test failed:', error);
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testMySQLConnection();
}
