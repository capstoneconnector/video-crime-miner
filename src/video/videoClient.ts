import { InstanceConfigInstanceCountInteger } from "../../node_modules/aws-sdk/clients/braket";
import { int } from "../../node_modules/aws-sdk/clients/datapipeline";
import { float } from "../../node_modules/aws-sdk/clients/lightsail";
import { stdout } from "process";
import { resolve } from "path";
const ck = require('ckey')

require("dotenv").config()
const fs = require('fs')
const path = require('path')

// Set the AWS Region.
const REGION = ck.AWS_REKOG_REGION; //e.g. "us-east-1"

// import required aws clients
const rekog = require("@aws-sdk/client-rekognition")
const awsSNS = require("@aws-sdk/client-sns")
const awsSQS= require("@aws-sdk/client-sqs")

// nested interfaces for response handling from rekognition
interface BoxCoordinates {
  Width: float;
  Top: float;
  Left: float;
  Height: float;
}

interface InstanceContent {
  Confidence: float;
  BoundingBox: BoxCoordinates;
}

interface ParentContent {
  Name: string;
}

interface LabelContent {

  Name: string;
  Confidence: float;
  Instances: InstanceContent[];

  Parents: ParentContent[];
}

interface LabelResponse {
  
  Label: LabelContent;

  Timestamp: int;

}

// set aws credentials
const accessKeyId = ck.AWS_ACCESS_KEY;
const secretAccessKey = ck.AWS_SECRET_KEY;

// Create rekog, SQS, and SNS service objects
const sqsClient = new awsSQS.SQSClient({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: REGION });
const snsClient = new awsSNS.SNSClient({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: REGION });
const rekClient = new rekog.RekognitionClient({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: REGION });

// Set bucket and video variables
const bucket = "video-crime-miner-video-test-bucket";
const videoName = "Test Security Footage.mp4";
const roleArn = String(ck.AWS_ROLEARN_NAME);
var startJobId = ""

// initialize configuirations for sns and sqs clients
var ts = Date.now();
const snsTopicName = "AmazonRekognitionExample" + ts;
const snsTopicParams = {Name: snsTopicName}
const sqsQueueName = "AmazonRekognitionQueue-" + ts;

var jsonReportContainer = {};

// Set the parameters for sqs queue
const sqsParams = {
    QueueName: sqsQueueName, //SQS_QUEUE_URL
    Attributes: {
      DelaySeconds: "60", // Number of seconds delay.
      MessageRetentionPeriod: "86400", // Number of seconds delay.
    },
  };

async function createTopicandQueue(){
    
    try {
      // Create SNS topic
      
      const topicResponse = await snsClient.send(new awsSNS.CreateTopicCommand(snsTopicParams));
      
      const topicArn = String(topicResponse.TopicArn)
      //console.log("Success", topicResponse);
      // Create SQS Queue
      const sqsResponse = await sqsClient.send(new awsSQS.CreateQueueCommand(sqsParams));
      //console.log("Success", sqsResponse);
      const sqsQueueCommand = await sqsClient.send(new awsSQS.GetQueueUrlCommand({QueueName: sqsQueueName}))
      const sqsQueueUrl = sqsQueueCommand.QueueUrl
      const attribsResponse = await sqsClient.send(new awsSQS.GetQueueAttributesCommand({QueueUrl: sqsQueueUrl, AttributeNames: ['QueueArn']}))
      const attribs = attribsResponse.Attributes
      //console.log(attribs)
      const queueArn = attribs.QueueArn
      // subscribe SQS queue to SNS topic
      const subscribed = await snsClient.send(new awsSNS.SubscribeCommand({TopicArn: topicArn, Protocol:'sqs', Endpoint: queueArn}))
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
      
      const response = await sqsClient.send(new awsSQS.SetQueueAttributesCommand({QueueUrl: sqsQueueUrl, Attributes: {Policy: JSON.stringify(policy)}}))
      
      //console.log(response)
      //console.log(sqsQueueUrl, topicArn)
      return String(sqsQueueUrl) + "$" + topicArn;
  
    } catch (err) {

      console.log("Error", err);
      return ""
    }
};

async function startLabelDetection (roleArn: string, snsTopicArn:string, bucketWithVideo:string, nameOfVideoToAnalyze:string) {
    try {
      //Initiate label detection and update value of startJobId with returned Job ID
     const labelDetectionResponse = await rekClient.send(new rekog.StartLabelDetectionCommand({Video:{S3Object:{Bucket:bucketWithVideo, Name:nameOfVideoToAnalyze}}, 
        NotificationChannel:{RoleArn: roleArn, SNSTopicArn: snsTopicArn}}));
        startJobId = labelDetectionResponse.JobId
        console.log(`JobID: ${startJobId}`)
        return startJobId
    } catch (err) {
      console.log("Error", err);
      return ""
    }
  };

async function getLabelDetectionResults(startJobId: string) {

    console.log("Retrieving Label Detection results")
    // Set max results, paginationToken and finished will be updated depending on response values
    var maxResults = 10
    var paginationToken = ''
    var finished = false
  
    // Begin retrieving label detection results
    while (finished == false){
      var response = await rekClient.send(new rekog.GetLabelDetectionCommand({JobId: startJobId, MaxResults: maxResults, 
        NextToken: paginationToken, SortBy:'TIMESTAMP'}))
        // Log metadata
        console.log(`Codec: ${response.VideoMetadata.Codec}`)
        console.log(`Duration: ${response.VideoMetadata.DurationMillis}`)
        console.log(`Format: ${response.VideoMetadata.Format}`)
        console.log(`Frame Rate: ${response.VideoMetadata.FrameRate}`)

        // For every detected label, log label, confidence, bounding box, and timestamp
        response.Labels.forEach(function(labelDetection: LabelResponse) {
          

          var label = labelDetection.Label
          
         

          

          console.log(`Timestamp: ${labelDetection.Timestamp}\nLabel: ${label.Name}\nConfidence: ${label.Confidence}` + "\nInstances:")
          label.Instances.forEach(function (instance: InstanceContent){
            console.log("Confidence: " + String(instance.Confidence) + "Bounding Box:\nTop: " + String(instance.BoundingBox.Top) + "\nLeft: " + String(instance.BoundingBox.Left) + "\nWidth: " + String(instance.BoundingBox.Width) + "\nHeight: " + String(instance.BoundingBox.Height))
            
          })
        //console.log()
        // Log parent if found
        console.log("   Parents:")
        label.Parents.forEach(parent =>{
          
          console.log(`    ${parent.Name}`)
        })
        //console.log()
        // Searh for pagination token, if found, set variable to next token
        if (String(response).includes("NextToken")){
          paginationToken = response.NextToken
  
        }else{
          jsonReportContainer = JSON.stringify(response.Labels)
          finished = true
        }
  
        })
    }
}

// Checks for status of job completion
async function getSQSMessageSuccess (sqsQueueUrl:string, startJobId:string) {
    try {
      // Set job found and success status to false initially
      var jobFound = false
      var succeeded = false
      var dotLine = 0
      // while not found, continue to poll for response
      while (jobFound == false){
        var sqsReceivedResponse = await sqsClient.send(new awsSQS.ReceiveMessageCommand({QueueUrl:sqsQueueUrl, 
            MessageAttributeNames: 'All', 
            MaxNumberOfMessages: 10
        }));
        if (sqsReceivedResponse){
          var responseString = JSON.stringify(sqsReceivedResponse)
          if (!responseString.includes('Body')){
            if (dotLine < 40) {
              console.log('.')
              dotLine = dotLine + 1
            }else {
              console.log('')
              dotLine = 0 
            };
            stdout.write('', () => {
              console.log('');
            });
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue
          }
        }
  
        // Once job found, log Job ID and return true if status is succeeded
        for (var message of sqsReceivedResponse.Messages){
          console.log("Retrieved messages:")
          var notification = JSON.parse(message.Body)
          var rekMessage = JSON.parse(notification.Message)
          var messageJobId = rekMessage.JobId
          if (String(rekMessage.JobId).includes(String(startJobId))){
            console.log('Matching job found:')
            console.log(rekMessage.JobId)
            jobFound = true
            console.log(rekMessage.Status)
            if (String(rekMessage.Status).includes(String("SUCCEEDED"))){
              succeeded = true
              console.log("Job processing succeeded.")
              var sqsDeleteMessage = await sqsClient.send(new awsSQS.DeleteMessageCommand({QueueUrl:sqsQueueUrl, ReceiptHandle:message.ReceiptHandle}));
            }
          }else{
            console.log("Provided Job ID did not match returned ID.")
            var sqsDeleteMessage = await sqsClient.send(new awsSQS.DeleteMessageCommand({QueueUrl:sqsQueueUrl, ReceiptHandle:message.ReceiptHandle}));
          }
        }
      }
    return succeeded
    } catch(err) {
      console.log("Error", err);
    }
  }


  // Start label detection job, sent status notification, check for success status
// Retrieve results if status is "SUCEEDED", delete notification queue and topic
async function runLabelDetectionAndGetResults(bucketWithVideo:string = "video-crime-miner-video-test-bucket", nameOfVideoToAnalyze:string = "Crowded People Walking Down Oxford Street London 4K UHD Stock Video Footage-ng8Wivt52K0.mp4") {
    try {

        const sqsAndTopic  = createTopicandQueue()
        const startLabelDetectionRes = startLabelDetection(roleArn, (await sqsAndTopic).split('$')[1], bucketWithVideo, nameOfVideoToAnalyze)
      /*const sqsAndTopic  = new Promise ((resolve, reject) => {
        resolve(createTopicandQueue())
      })
      sqsAndTopic.then(
        (value) => {
            const startLabelDetectionRes = new Promise ((resolve, reject) => {
                resolve(startLabelDetection(roleArn, value[1]) )
            });
            
        } )*/
      
      const getSQSMessageStatus = await getSQSMessageSuccess((await sqsAndTopic).split('$')[0], await startLabelDetectionRes)
      console.log(getSQSMessageSuccess)
      if (await getSQSMessageSuccess){
        console.log("Retrieving results:")
        const results = await getLabelDetectionResults(await startLabelDetectionRes)
      }
      const deleteQueue = await sqsClient.send(new awsSQS.DeleteQueueCommand({QueueUrl: (await sqsAndTopic).split('$')[0]}));
      const deleteTopic = await snsClient.send(new awsSNS.DeleteTopicCommand({TopicArn: (await sqsAndTopic).split('$')[1]}));
      console.log("Successfully deleted.")

      var newReport = jsonReportContainer

      console.log(newReport)

      return newReport

    } catch (err) {
      console.log("Error", err);
    }
  };

export {createTopicandQueue, startLabelDetection, getLabelDetectionResults, getSQSMessageSuccess, runLabelDetectionAndGetResults}