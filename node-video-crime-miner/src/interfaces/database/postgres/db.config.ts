import pg from 'pg'

const pool = new pg.Pool({
  host: process.env['DBHOST'],
  port: parseInt(process.env['DBPORT']!) || 5432,
  user: process.env['DBUSER'],
  password: process.env['DBPASSWORD'],
  database: process.env['DB'],
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
})

export { pool }
