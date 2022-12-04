import pg from "pg"

const pool = new pg.Pool({
  host: process.env["DBHOST"],
  port: 5432,
  user: process.env["DBUSER"],
  database: process.env["DB"],
  password: process.env["DBPASSWORD"],
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
})
/*
import { Client } from 'ts-postgres'

try{
var attributes = {
  host: process.env["DBHOST"],
  port: 5432,
  user: process.env["DBUSER"],
  database: process.env["DB"],
  password: process.env["DBPASSWORD"],
  //keepAlive: true,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
}

console.log(attributes)

var postgresClient: Client = new Client({
  host: process.env["DBHOST"],
  port: 5432,
  user: process.env["DBUSER"],
  database: process.env["DB"],
  password: process.env["DBPASSWORD"],
  keepAlive: true
  
})

/*
async () => {
  return await postgresClient.connect()
}


}catch(e){
  console.log(e)
}
*/

export {pool}