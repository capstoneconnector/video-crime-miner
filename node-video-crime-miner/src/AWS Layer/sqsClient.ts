var ck = require('ckey') // This needs to be require because of: https://stackoverflow.com/a/42505940/17977811
import { SQSClient, CreateQueueCommand, GetQueueUrlCommand, GetQueueAttributesCommand, SetQueueAttributesCommand } from "@aws-sdk/client-sqs"

// AWS .env variables
const region  = ck.REGION
const accessKeyId = ck.AWS_ACCESS_KEY
const secretAccessKey = ck.AWS_SECRET_KEY

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