import {upload, listObjects} from "../AWS Layer/s3Connector.js"
import {startVideoFacesDetection, getVideoFacesDetectionOutput} from '../AWS Layer/Rekognition/videoFaceUtils.js'
import { startLabelDetection, getLabelDetectionResults } from '../AWS Layer/Rekognition/videoLabelUtils.js'

var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

function main(){
    var choices = "(1) Upload a file\n(2) Scan for faces in a video\n(3) Label Detection for Video\n(4) View my files\n(q) Quit"
    console.log("What would you like to do?")
    console.log(choices)

    readline.question("Choose an option: ", (x:any) => {
        resolveInput(x)
    })
}


function resolveInput(userInput:any){
    if(userInput=="q"){
        //exit the program
        process.exit()
    }else if(userInput=="1"){
        //upload a file
        readline.question("Input file path: ", (x:any) => {
            upload("video-crime-miner-video-test-bucket", x).then((response:any) => {
                console.log(response)
            })
        })
    }else if(userInput=="2"){
        //scan video faces
        readline.question("Input AWS filename: ", (x:any) => {
            startVideoFacesDetection("video-crime-miner-video-test-bucket", x).then((jobId:any) => {
                    console.log(jobId)
                    getVideoFacesDetectionOutput(jobId).then((response:any) => {
                        console.log(response)
                    })
            })
        })
    }else if(userInput=="3"){
        //label detection video
        console.log("This may take a while...")
        readline.question("Input AWS filename: ", (x:any) => {
            startLabelDetection("video-crime-miner-video-test-bucket", x).then((jobId:any) => {
                    console.log(jobId)
                    getLabelDetectionResults(jobId).then((response:any) => {
                        console.log(response)
                    })
            })
        })
    }else if(userInput=="4"){
        //view files
        listObjects("video-crime-miner-video-test-bucket")
    }else{
        console.log("ERROR: invalid choice")
    }
}




main()