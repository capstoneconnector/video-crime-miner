import * as dotenv from "dotenv"
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from "@aws-sdk/client-rekognition"

dotenv.config({ path: "../../../.env"})

const region = process.env["REGION"] || "REGION NOT DEFINED IN .ENV"
const accessKeyId = process.env["AWS_ACCESS_KEY_ID"] || "AWS ACCESS KEY NOT DEFINED IN .ENV"
const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"] || "AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV"
const roleArn = process.env["AWS_ROLE_ARN"] || "AWS ROLE ARN NOT DEFINED IN .ENV"

// Create the Rekognition Client
var attributes = {
  region : region,
  credentials:{
      accessKeyId : accessKeyId,
      secretAccessKey : secretAccessKey
  }
}
//console.log("VIDEOLABELUTILS ENV VAR ATTRIBUTES")
//console.log(attributes)
const client  = new RekognitionClient(attributes)

async function startLabelDetection(bucketName:string, videoName:string, clientToUse:RekognitionClient | any=client) {
  try {
    var attributes = {
      Video: { 
        S3Object: { 
          Name: videoName,
          Bucket: bucketName,
        }
      }/*,
      NotificationChannel:{
        RoleArn: roleArn, 
        SNSTopicArn: snsTopicArn
      }
      */
    }

    // Returns jobId to get when it's finished by getVideoFacesDetectionOutput
    const command = new StartLabelDetectionCommand(attributes)
    const result = await clientToUse.send(command)
    return result.JobId || {error:"Couldn't start faces detection"}
  } catch (e) {
    console.log('error', e)
        return {
            startLabelsError: e
        }
  }
}

async function getLabelDetectionResults(id: string, clientToUse:RekognitionClient | any=client) {
  try {
    const parameters = {
        JobId: id
    }
    const command = new GetLabelDetectionCommand(parameters)
    var finished = false
    var result
    while(!finished){
        result = await clientToUse.send(command)
        if (result.JobStatus == "SUCCEEDED") {
            finished = true;
        }
    }
    //console.log(result)
    return result || {error: "Could not get Label Detection Results"}
  } catch (e) {
  console.log('error', e)
  }
}

export { startLabelDetection, getLabelDetectionResults }