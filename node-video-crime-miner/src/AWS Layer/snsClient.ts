import * as dotenv from 'dotenv'
import { SNSClient, CreateTopicCommand, SubscribeCommand } from '@aws-sdk/client-sns'

dotenv.config({ path: '/.env' })

// AWS .env variables
const region = process.env['REGION'] || 'REGION NOT DEFINED IN .ENV'
const accessKeyId = process.env['AWS_ACCESS_KEY_ID'] || 'AWS ACCESS KEY NOT DEFINED IN .ENV'
const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] || 'AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV'

// Create SNS client to send commands to
const attributes = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}
// console.log("SNS CLIENT ENV VAR ATTRIBUTES")
// console.log(attributes)
const client = new SNSClient(attributes)

async function createTopic (topicName: string, clientToUse: SNSClient | any = client) {
  try {
    const attributes = {
      Name: topicName
    }
    const command = new CreateTopicCommand(attributes)
    const result = await clientToUse.send(command)
    return result || { error: 'Error' }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

async function subscribeSQStoSNS (topicArn: string, queueArn: string, protocol: string = 'sqs', clientToUse: SNSClient | any = client) {
  try {
    const attributes = {
      TopicArn: topicArn,
      Protocol: protocol,
      Endpoint: queueArn
    }
    const command = new SubscribeCommand(attributes)
    const result = await client.send(command)
    return result || { error: 'Error' }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

export { createTopic, subscribeSQStoSNS }
