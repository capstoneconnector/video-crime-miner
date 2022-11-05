require("dotenv").config()
const AWS = require("@aws-sdk/client-rekognition");

// const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

var jobId = startVideoFacesDetection()
var output = getVideoFacesDetectionOutput(jobId)

function connect() {
	const rekognition = new AWS({
		accessKeyId,
		secretAccessKey
	})

	return rekognition
}

function startVideoFacesDetection(){
    var rekognition = connect()
    var attributes = {
        "FaceAttributes": "DEFAULT",
        "JobTag": "string",
        "Video": { 
           "S3Object": { 
              "Bucket": "test-videos-video-crime-processor",
              "Name": "Garland police releases footage of gunman in fatal shooting of 3 teens at gas station-djU2QN9CI_Y.mp4",
           }
        }
     }
    return rekognition.StartFaceDetection(attributes)
}

function getVideoFacesDetectionOutput(jobId:string){
    var rekognition = connect()
    return rekognition.getFaceDetection()
}

function sendRequest(){
    var rekognition = connect()
    rekognition.compareFaces({}, function (err: { stack: any; }, data: any) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
    
    return "https://aws.com/"
}

export {startVideoFacesDetection, getVideoFacesDetectionOutput}