import {Pool} from "pg"

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
*/

}catch(e){
  console.log(e)
}

async function teststuff(){
  await postgresClient.connect();

    try {
        // Querying the client returns a query result promise
        // which is also an asynchronous result iterator.
        const result = postgresClient.query(
            "SELECT 'Hello ' || $1 || '!' AS message",
            ['world']
        );

        for await (const row of result) {
            // 'Hello world!'
            console.log(row.get('message'));
        }
    } finally {
        await postgresClient.end();
    }
}

async function getCases() {
  console.log("in getcases()")
  try {
    var rows = []
    await postgresClient.connect() //NEED TO REMOVE THIS FROM FUNCTION AND HAVE IT ONLY RUN ONCE!
    // Querying the client returns a query result promise
    // which is also an asynchronous result iterator.
    console.log("getting query")
    const query = postgresClient.query(
        "SELECT * FROM public.case"
    )
    for await (const row of query) {
      console.log("pushing row")
      rows.push(row.data)
    }
    return rows
  } catch (e){
    console.log({error:e})
    return e
  }finally {
    await postgresClient.end()
    console.log("exited postgres")
  }
}

export {teststuff, postgresClient, getCases}