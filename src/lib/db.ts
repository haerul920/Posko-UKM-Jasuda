import mysql from 'mysql2/promise';

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

const pool = global.mysqlPool || mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'jasuda_user',
  password: process.env.MYSQL_PASSWORD || 'jasuda_password',
  database: process.env.MYSQL_DATABASE || 'posko_ukm_jasuda',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00',
  dateStrings: true,
});

if (process.env.NODE_ENV !== 'production') {
  global.mysqlPool = pool;
}

export default pool;
