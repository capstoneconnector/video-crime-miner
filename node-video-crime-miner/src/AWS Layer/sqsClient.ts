import * as dotenv from "dotenv"
import { SQSClient, CreateQueueCommand, GetQueueUrlCommand, GetQueueAttributesCommand, SetQueueAttributesCommand } from "@aws-sdk/client-sqs"

dotenv.config({ path: "/.env"})

// AWS .env variables
const region = process.env["REGION"] || "REGION NOT DEFINED IN .ENV"
const accessKeyId = process.env["AWS_ACCESS_KEY_ID"] || "AWS ACCESS KEY NOT DEFINED IN .ENV"
const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"] || "AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV"

// Create SQS client to send commands to
const attributes = {
    region : region,
    credentials:{
        accessKeyId : accessKeyId,
        secretAccessKey : secretAccessKey
    }
}
const client = new SQSClient(attributes)

async function createQueue(queueName:string){
    try{
        const attributes = {
            QueueName: queueName
        }
        const command = new CreateQueueCommand(attributes)
        const result = await client.send(command)
        return result || {error:"Error"}
    }catch(e){
        console.log(e)
        return {error:e}
    }
}

async function getQueueUrl(queueName:string){
    try{
        const attributes = {
            QueueName: queueName
        }
        const command = new GetQueueUrlCommand(attributes)
        const result = await client.send(command)
        return result || {error:"Error"}
    }catch(e){
        console.log(e)
        return {error:e}
    }
}

async function getQueueAttributes(queueUrl:string){
    try{
        const attributes = {
            QueueUrl: queueUrl
        }
        const command = new GetQueueAttributesCommand(attributes)
        const result = await client.send(command)
        return result || {error:"Error"}
    }catch(e){
        console.log(e)
        return {error:e}
    }
}

async function setQueueAttributes(queueUrl:string, attributesInJson:Record<string, string>){
    // This was in the attributes const before, not sure if it belongs there now
    /*
    const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "MyPolicy",
            Effect: "Allow",
            Principal: {AWS: "*"},
            Action: "SQS:SendMessage",
            Resource: queueArn,
            Condition: {
              ArnEquals: {
                'aws:SourceArn': topicArn
              }
            }
          }
        ]
      }
    */

    try{
        const attributes = {
            QueueUrl: queueUrl,
            Attributes: attributesInJson //The above commented out portion was here, but should it always be hardcoded? Not sure!
        }
        const command = new SetQueueAttributesCommand(attributes)
        const result = await client.send(command)
        return result || {error:"Error"}
    }catch(e){
        console.log(e)
        return {error:e}
    }
}

export { createQueue, getQueueUrl, getQueueAttributes, setQueueAttributes }