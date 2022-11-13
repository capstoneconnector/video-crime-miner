var ck = require('ckey') // This needs to be require because of: https://stackoverflow.com/a/42505940/17977811
import { SNSClient, CreateTopicCommand, SubscribeCommand } from "@aws-sdk/client-sns"

// AWS .env variables
const region  = ck.REGION
const accessKeyId = ck.AWS_ACCESS_KEY
const secretAccessKey = ck.AWS_SECRET_KEY

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