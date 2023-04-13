
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from '@aws-sdk/client-rekognition'

import { SNSClient, CreateTopicCommand, SubscribeCommand, DeleteTopicCommand } from '@aws-sdk/client-sns'

import { SQSClient, CreateQueueCommand, GetQueueUrlCommand, GetQueueAttributesCommand, SetQueueAttributesCommand, ReceiveMessageCommand, DeleteQueueCommand } from '@aws-sdk/client-sqs'

const region = process.env['REGION'] || 'REGION NOT DEFINED IN .ENV'
const accessKeyId = process.env['AWS_ACCESS_KEY_ID'] || 'AWS ACCESS KEY NOT DEFINED IN .ENV'
const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] || 'AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV'
const bucketName = process.env['REKOG_BUCKET_NAME'] || 'REKOG BUCKET NAME NOT DEFINED IN .ENV'
const roleArn = process.env['AWS_ROLE_ARN'] || 'AWS ROLE ARN NOT DEFINED IN .ENV'

// Create the Rekognition Client
const attributes = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}
// console.log("VIDEOLABELUTILS ENV VAR ATTRIBUTES")
// console.log(attributes)
const client = new RekognitionClient(attributes)

const sqsClient = new SQSClient(attributes)

const snsClient = new SNSClient(attributes)

async function startLabelDetection (videoName: string, labelFilters: string[] = [], clientToUse: RekognitionClient | any = client, testing:boolean=false) {
  try {

    var newUT: number

    var newT_Q: any = ["0", "1"]

    if (!testing) {
    newUT = Date.now()

    newT_Q = await createNewTopicAndQueue(newUT.toString())
    }

    var attributes: any

    if (!testing) {
      attributes = {
        Video: {
          S3Object: {
            Name: videoName,
            Bucket: bucketName
          }
        },
        Features: ['GENERAL_LABELS'],
        Settings: {
          GeneralLabels: {
            LabelInclusionFilters: labelFilters // Enter terms to filter here
          }
        },
        NotificationChannel:{
          RoleArn: roleArn, 
          SNSTopicArn: newT_Q[1]
        }
        
      }
    }
    else {
      attributes = {
        Video: {
          S3Object: {
            Name: videoName,
            Bucket: bucketName
          }
        },
        Features: ['GENERAL_LABELS'],
        Settings: {
          GeneralLabels: {
            LabelInclusionFilters: labelFilters // Enter terms to filter here
          }
        }
        
      }
    }

    // Returns jobId, which can be used by the collectLabelDetections method to collect job results
    const command = new StartLabelDetectionCommand(attributes)

    const result = await clientToUse.send(command)

    var newJobId:string = result.JobId

    return { JobID: newJobId, queueUrl: newT_Q[0], topicArn: newT_Q[1] }
    
  } catch (e) {
    console.log('error', e)
    return {
      startLabelsError: e
    }
  }
}

async function createNewTopicAndQueue(unixtime:string) {

  try {

    const snsTopicName = "AmazonRekognitionExample" + unixtime;
    const snsTopicParams = {Name: snsTopicName}
    const sqsQueueName = "AmazonRekognitionQueue-" + unixtime;

    // Set the parameters
    const sqsParams = {
      QueueName: sqsQueueName, //SQS_QUEUE_URL
      Attributes: {
        DelaySeconds: "60", // Number of seconds delay.
        MessageRetentionPeriod: "86400", // Number of seconds delay.
      },
    };

    // Create SNS topic
    const topicResponse = await snsClient.send(new CreateTopicCommand(snsTopicParams));
    const topicArn = topicResponse.TopicArn

    // Create SQS Queue
    const sqsResponse = await sqsClient.send(new CreateQueueCommand(sqsParams));
    const sqsQueueCommand = await sqsClient.send(new GetQueueUrlCommand({QueueName: sqsQueueName}))
    const sqsQueueUrl = sqsQueueCommand.QueueUrl
    const attribsResponse = await sqsClient.send(new GetQueueAttributesCommand({QueueUrl: sqsQueueUrl, AttributeNames: ['QueueArn']}))
    const attribs = attribsResponse.Attributes

    const queueArn = attribs['QueueArn']
    // subscribe SQS queue to SNS topic
    const subscribed = await snsClient.send(new SubscribeCommand({TopicArn: topicArn, Protocol:'sqs', Endpoint: queueArn}))

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
    };

    const response = await sqsClient.send(new SetQueueAttributesCommand({QueueUrl: sqsQueueUrl, Attributes: {Policy: JSON.stringify(policy)}}))

    return [ sqsQueueUrl, topicArn ]
  } catch (e) {
    console.log('error', e)
  }
}

async function checkJobStatus(qrl:string, clientToUse: RekognitionClient | any = client) {
  try {

    //console.log("INPUT QUEUEURL: ", qrl)
    var sqsReceivedResponse = await sqsClient.send(new ReceiveMessageCommand({QueueUrl:qrl, MaxNumberOfMessages:10}))

    //var responseString = JSON.stringify(sqsReceivedResponse)
    
    return sqsReceivedResponse

  } catch (e) {
    console.log('error', e)
  }
}

async function deleteTAndQ (qrl:string, topic:string, clientToUse: RekognitionClient | any = client) {
  try {

    const deleteQueue = await sqsClient.send(new DeleteQueueCommand({QueueUrl: qrl}));
    const deleteTopic = await snsClient.send(new DeleteTopicCommand({TopicArn: topic}));

    return deleteTopic

  } catch (e) {
    console.log('error', e)
  }
}

async function collectLabelDetections (labelDetectJobId: string, clientToUse: RekognitionClient | any = client) {
  // container for detected labels, will be returned at end of function
  const labelsDetected: any[] = []

  // fetch first batch of detected labels and recieve first token
  const dataCheck = await getLabelDetectionChunk(labelDetectJobId, undefined, clientToUse)

  // store first batch of labels
  dataCheck.Labels.forEach( (key:any) => {
    labelsDetected.push(key)
  } )
  //labelsDetected.push(dataCheck.Labels)

  // tracks current token
  let tokenToUse = dataCheck.NextToken

  let VideoMetadata

  // the last batch will not have a token, ending this loop
  while (tokenToUse != undefined) {
    // fetch batch of labels using the current token
    await getLabelDetectionChunk(labelDetectJobId, tokenToUse, clientToUse).then(async (dataResponse) => {
      // store labels from new batch

      Object.keys(dataResponse).forEach(function (key) {
        if (key == 'Labels') {
          dataResponse[key].forEach(function (item: any) {
            labelsDetected.push(item)
            // if (item["Name"] == "Fence") {
            //console.log('\n\n' + JSON.stringify(item))
            // }
          })
          // console.log('Key : ' + key + ', Value : ' + JSON.stringify(dataResponse[key]))
        }

      })
      //labelsDetected.push(dataResponse.Labels)
      VideoMetadata = dataResponse.VideoMetadata

      // store new token
      tokenToUse = dataResponse.NextToken
    })
  }



  // array of Labels
  // see https://docs.aws.amazon.com/rekognition/latest/APIReference/API_GetLabelDetection.html
  // section 'Response Syntax', "Labels" Attribute
  return [ labelsDetected, VideoMetadata ]
}

async function getLabelDetectionChunk (id: string, nextToken: string | undefined = undefined, clientToUse: RekognitionClient | any = client) {
  try {
    const parameters = {
      JobId: id,
      MaxResults: 20, // number of objects labeled before recieving results
      NextToken: nextToken // token to recieve next batch

    }
    const command = new GetLabelDetectionCommand(parameters)
    let finished = false
    let result
    while (!finished) {
      result = await clientToUse.send(command)
      if (result.JobStatus == 'SUCCEEDED') {
        finished = true
        return result
      }
    }
    return result || { error: 'Could not get Label Detection Results' }
  } catch (e) {
    console.log('error', e)
  }
}

async function getLabelDetectionResults (id: string, clientToUse: RekognitionClient | any = client) {
  try {
    const parameters = {
      JobId: id,
      MaxResults: 20

    }
    const command = new GetLabelDetectionCommand(parameters)
    let finished = false
    let result
    while (!finished) {
      result = await clientToUse.send(command)
      if (result.JobStatus == 'SUCCEEDED') {
        finished = true
      }
    }
    return result || { error: 'Could not get Label Detection Results' }
  } catch (e) {
    console.log('error', e)
  }
}

export { startLabelDetection, getLabelDetectionResults, getLabelDetectionChunk, collectLabelDetections, checkJobStatus, deleteTAndQ, client }
