import * as dotenv from "dotenv"
import { SNSClient, CreateTopicCommand, SubscribeCommand } from "@aws-sdk/client-sns"

dotenv.config({ path: "/.env"})

// AWS .env variables
const region = process.env["REGION"] || "REGION NOT DEFINED IN .ENV"
const accessKeyId = process.env["AWS_ACCESS_KEY_ID"] || "AWS ACCESS KEY NOT DEFINED IN .ENV"
const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"] || "AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV"

// Create SNS client to send commands to
const attributes = {
    region : region,
    credentials:{
        accessKeyId : accessKeyId,
        secretAccessKey : secretAccessKey
    }
}
const client = new SNSClient(attributes)

async function createTopic(topicName:string){
    try{
        const attributes = {
            Name: topicName
        }
        const command = new CreateTopicCommand(attributes)
        const result = await client.send(command)
        return result || {error:"Error"}
    }catch(e){
        console.log(e)
        return {error: e}
    }
}

async function subscribeSQStoSNS(topicArn:string, protocol:string){
    try{
        const attributes = {
            TopicArn: topicArn,
            Protocol: protocol
        }
        const command = new SubscribeCommand(attributes)
        const result = await client.send(command)
        return result || {error:"Error"}
    }catch(e){
        console.log(e)
        return {error: e}
    }
}

export { createTopic, subscribeSQStoSNS }