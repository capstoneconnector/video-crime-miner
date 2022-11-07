require("dotenv").config()
const AWS = require("@aws-sdk/client-rekognition");

// const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

// Example code for testing face detection output
// var jobId = startVideoFacesDetection("example", "example")
// var output = getVideoFacesDetectionOutput(jobId)

// Function to connect to AWS Rekognition client
function connect() {
	const rekognition = new AWS({
		accessKeyId,
		secretAccessKey
	})

	return rekognition
}

function startVideoFacesDetection(bucketName:string, videoName:string){
    var rekognition = connect()
    var attributes = {
        "FaceAttributes": "DEFAULT",
        "Video": { 
           "S3Object": { 
              "Bucket": bucketName,
              "Name": videoName,
           }
        }
     }
    return rekognition.StartFaceDetection(attributes) // Returns jobId
}

// Gets the output based on jobId for face recognition
function getVideoFacesDetectionOutput(jobId:string){
    var rekognition = connect()
    return rekognition.getFaceDetection()
}
/*
function sendRequest(){
    var rekognition = connect()
    rekognition.compareFaces({}, function (err: { stack: any; }, data: any) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
    
    return "https://aws.com/"
}
*/

export {startVideoFacesDetection, getVideoFacesDetectionOutput}