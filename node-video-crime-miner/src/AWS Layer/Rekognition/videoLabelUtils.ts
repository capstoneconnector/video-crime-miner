import * as dotenv from "dotenv"
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from "@aws-sdk/client-rekognition"

dotenv.config({ path: "../../../../.env"})

const region = process.env["REGION"] || "REGION NOT DEFINED IN .ENV"
const accessKeyId = process.env["AWS_ACCESS_KEY_ID"] || "AWS ACCESS KEY NOT DEFINED IN .ENV"
const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY"] || "AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV"

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