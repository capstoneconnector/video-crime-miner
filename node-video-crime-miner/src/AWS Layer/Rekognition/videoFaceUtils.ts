var ck = require('ckey') // This needs to be require because of: https://stackoverflow.com/a/42505940/17977811
var { RekognitionClient, StartFaceDetectionCommand, GetFaceDetectionCommand} = require("@aws-sdk/client-rekognition");

var region = ck.REGION
var accessKeyId = ck.AWS_ACCESS_KEY_ID
var secretAccessKey = ck.AWS_SECRET_ACCESS_KEY


//const client  = new RekognitionClient(region, accessKeyId, secretAccessKey)
var attributes = {
    region : region,
    credentials:{
        accessKeyId : accessKeyId,
        secretAccessKey : secretAccessKey
    }
}
const client  = new RekognitionClient(attributes)

async function startVideoFacesDetection(bucketName:string, videoName:string){
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
        const command = new StartFaceDetectionCommand(attributes)
        const result = await client.send(command)
        return result.JobId || {error:"Couldn't start faces detection"}
	} catch (e) {
		console.log('error', e)
        return {
            error: e
        }
	}
}

// Gets the output based on jobId for face recognition
async function getVideoFacesDetectionOutput(id:string){
    try {
        const parameters = {
            JobId: id
        }
        const command = new GetFaceDetectionCommand(parameters)
        var finished = false
        var result
        while(!finished){
            result = await client.send(command)
            if (result.JobStatus == "SUCCEEDED") {
                finished = true;
            }
        }
        //console.log(result)
        return result || {error: "Could not get Face Detection Results"}
	} catch (e) {
		console.log('error', e)
	}
}

// Example code for testing face detection output
//startVideoFacesDetection("video-crime-miner-video-test-bucket", "testVideo.mp4").then(jobId => {
//    getVideoFacesDetectionOutput(jobId)
//})

export {startVideoFacesDetection, getVideoFacesDetectionOutput}