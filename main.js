const { fail } = require("assert")
const { upload, listObjects } = require("./src/video/s3Connector.js")
const { startVideoFacesDetection, getVideoFacesDetectionOutput } = require('./src/video/videoUtils.js')
const { runLabelDetectionAndGetResults } = require('./src/video/videoClient.js')
//import {stuff} from './src/video/videoClient.js'

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

function main(){
    var choices = "(1) Upload a file\n(2) Scan for faces in a video\n(3) Label Detection for Video\n(4) View my files\n(q) Quit"
    console.log("What would you like to do?")
    console.log(choices)

    readline.question("Choose an option: ", x => {
        resolveInput(x)
    })
}


function resolveInput(userInput){
    if(userInput=="q"){
        //exit the program
        fail("user quit the program")
    }else if(userInput=="1"){
        //upload a file
        readline.question("Input file path: ", x => {
            upload("video-crime-miner-video-test-bucket", x).then(response => {
                console.log(response)
            })
        })
    }else if(userInput=="2"){
        //scan video faces
        readline.question("Input AWS filename: ", x => {
            startVideoFacesDetection("video-crime-miner-video-test-bucket", x).then(jobId => {
                    getVideoFacesDetectionOutput(jobId)
            })
        })
    }else if(userInput=="3"){
        //label detection video
        console.log("This may take a while...")
        
            runLabelDetectionAndGetResults().then(x => {
                console.log(x)
            })
    }else if(userInput=="4"){
        //view files
        listObjects("video-crime-miner-video-test-bucket")
    }else{
        console.log("ERROR: invalid choice")
        main()
    }
}




main()