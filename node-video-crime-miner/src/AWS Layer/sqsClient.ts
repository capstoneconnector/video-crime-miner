
import { SQSClient, CreateQueueCommand, GetQueueUrlCommand, GetQueueAttributesCommand, SetQueueAttributesCommand } from '@aws-sdk/client-sqs'
import { stringify } from 'querystring'

// AWS .env variables
const region = process.env['REGION'] || 'REGION NOT DEFINED IN .ENV'
const accessKeyId = process.env['AWS_ACCESS_KEY_ID'] || 'AWS ACCESS KEY NOT DEFINED IN .ENV'
const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] || 'AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV'

// uninitialized placeholder for name of queue to use for sqs operations ( see first line of try block in 'createQueue' function where it is initialized before the creation of a queue for the task )
let sqsQueueName = ''

// Create SQS client to send commands to
const attributes = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}
// console.log("SQS CLIENT ENV VAR ATTRIBUTES")
// console.log(attributes)
const client = new SQSClient(attributes)

async function createQueue (clientToUse: SQSClient | any = client) {
  try {
    sqsQueueName = 'AmazonRekognitionQueue' + String(Date.now())
    const attributes = {
      QueueName: sqsQueueName
    }
    const command = new CreateQueueCommand(attributes)
    const result = await clientToUse.send(command)
    return result || { error: 'Error' }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

async function getQueueUrl (queueName: string, clientToUse: SQSClient | any = client) {
  try {
    const attributes = {
      QueueName: queueName
    }
    const command = new GetQueueUrlCommand(attributes)
    const result = await clientToUse.send(command)
    return result || { error: 'Error' }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

async function getQueueAttributes (queueUrl: string, clientToUse: SQSClient | any = client) {
  try {
    const attributes = {
      QueueUrl: queueUrl,
      AttributeNames: ['QueueArn']
    }
    const command = new GetQueueAttributesCommand(attributes)
    const result = await clientToUse.send(command)
    return result || { error: 'Error' }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

async function setQueueAttributes (queueUrl: string, attributesInJson: Record<string, string> | any, clientToUse: SQSClient | any = client) {
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
  console.log('Policy: ' + JSON.stringify(attributesInJson))
  try {
    const attributes = {
      QueueUrl: queueUrl,
      Attributes: { Policy: JSON.stringify(attributesInJson) } // The above commented out portion was here, but should it always be hardcoded? Not sure!
    }
    const command = new SetQueueAttributesCommand(attributes)
    const result = await clientToUse.send(command)
    return result || { error: 'Error' }
  } catch (e) {
    console.log(e)
    return { error: e }
  }
}

export { createQueue, getQueueUrl, getQueueAttributes, setQueueAttributes }
