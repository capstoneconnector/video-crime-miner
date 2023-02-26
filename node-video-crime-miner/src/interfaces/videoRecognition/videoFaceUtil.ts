import * as dotenv from 'dotenv'
import { RekognitionClient, StartFaceDetectionCommand, GetFaceDetectionCommand } from '@aws-sdk/client-rekognition'

dotenv.config({ path: '../../../.env' })

const region = process.env['REGION'] || 'REGION NOT DEFINED IN .ENV'
const accessKeyId = process.env['AWS_ACCESS_KEY_ID'] || 'AWS ACCESS KEY NOT DEFINED IN .ENV'
const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] || 'AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV'

// Create the Rekognition Client
const attributes = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}
// console.log("VIDEOFACEUTILS ENV VAR ATTRIBUTES")
// console.log(attributes)
const client = new RekognitionClient(attributes)

async function startVideoFacesDetection (bucketName: string, videoName: string) {
  try {
    const attributes = {
      Video: {
        S3Object: {
          Name: videoName,
          Bucket: bucketName
        }
      }
    }
    // Returns jobId to get when it's finished by getVideoFacesDetectionOutput
    const command = new StartFaceDetectionCommand(attributes)
    const result = await client.send(command)
    return result.JobId || { error: "Couldn't start faces detection" }
  } catch (e) {
    console.log('error', e)
    return {
      error: e
    }
  }
}

// Gets the output based on jobId for face recognition
async function getVideoFacesDetectionOutput (id: string) {
  try {
    const parameters = {
      JobId: id
    }
    const command = new GetFaceDetectionCommand(parameters)
    let finished = false
    let result
    while (!finished) {
      result = await client.send(command)
      if (result.JobStatus == 'SUCCEEDED') {
        finished = true
      }
    }
    // console.log(result)
    return result || { error: 'Could not get Face Detection Results' }
  } catch (e) {
    console.log('error', e)
  }
}

// Example code for testing face detection output
// startVideoFacesDetection("video-crime-miner-video-test-bucket", "testVideo.mp4").then(jobId => {
//    getVideoFacesDetectionOutput(jobId)
// })

export { startVideoFacesDetection, getVideoFacesDetectionOutput }
