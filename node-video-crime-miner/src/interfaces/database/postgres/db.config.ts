import pg from 'pg'

function getAttribForPool () {

  var newAttribs = {
    host: "",
    port: 0,
    user: "",
    password: "",
    database: ""
  }

  if (process.env['NODE_ENV'] === "test") {
    newAttribs.host = process.env['TEST_POSTGRES_HOST']
  } else {
    newAttribs.host = process.env['DBHOST']
  }

  if (process.env['NODE_ENV'] === "test") {
    newAttribs.port = parseInt(process.env['TEST_POSTGRES_PORT'])
  } else {
    newAttribs.port = parseInt(process.env['DBPORT'])
  }

  if (process.env['NODE_ENV'] === "test") {
    newAttribs.user = process.env['TEST_POSTGRES_USER']
  } else {
    newAttribs.user = process.env['DBUSER']
  }

  if (process.env['NODE_ENV'] === "test") {
    newAttribs.password = process.env['TEST_POSTGRES_PASSWORD']
  } else {
    newAttribs.password = process.env['DBPASSWORD']
  }

  if (process.env['NODE_ENV'] === "test") {
    newAttribs.database = process.env['TEST_POSTGRES_DB']
  } else {
    newAttribs.database = process.env['DB']
  }

  return newAttribs

}

var dbAttribs = getAttribForPool()

const pool = new pg.Pool({
  host: dbAttribs.host,
  port: dbAttribs.port,
  user: dbAttribs.user,
  password: dbAttribs.password,
  database: dbAttribs.database,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
})

export { pool }
