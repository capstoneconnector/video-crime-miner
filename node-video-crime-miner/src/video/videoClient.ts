var ck = require('ckey') // This needs to be require because of: https://stackoverflow.com/a/42505940/17977811
//var {stdout} = require("process") // this has problems when converted to import statement!
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from "@aws-sdk/client-rekognition"


// Set the AWS Region.
const region = ck.AWS_REGION //e.g. "us-east-1"
// set AWS credentials
const accessKeyId = ck.AWS_ACCESS_KEY
const secretAccessKey = ck.AWS_SECRET_KEY

// Create the Rekognition Client
var attributes = {
  region : region,
  credentials:{
      accessKeyId : accessKeyId,
      secretAccessKey : secretAccessKey
  }
}
const client  = new RekognitionClient(attributes)

async function startLabelDetection(bucketName:string, videoName:string) {
  try {
    var attributes = {
      Video: { 
        S3Object: { 
          Name: videoName,
          Bucket: bucketName,
        }
      }
    }

    // Returns jobId to get when it's finished by getVideoFacesDetectionOutput
    const command = new StartLabelDetectionCommand(attributes)
    const result = await client.send(command)
    return result.JobId || {error:"Couldn't start faces detection"}
  } catch (e) {
    console.log('error', e)
        return {
            error: e
        }
  }
}

async function getLabelDetectionResults(id: string) {
  try {
    const parameters = {
        JobId: id
    }
    const command = new GetLabelDetectionCommand(parameters)
    var finished = false
    var result
    while(!finished){
        result = await client.send(command)
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