const { Pool } = require('pg')
const dotenv = require('dotenv')
// Load .env
const dotenvConf = dotenv.config({ path: './backend/config/.env' })
if (dotenvConf.error) throw dotenvConf.error

const conf = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
}

const pool = new Pool(conf)
pool.queryOne = async (queryString, values = []) => {
  const res = await pool.query(queryString, values)
  if (res.rows.length) {
    return res.rows[0]
  }
  return undefined
}

module.exports = pool
