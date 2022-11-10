// Angular-Video Connector Module

// TODO: Figure out how to connect this to the frontend

var s3 = require("./s3Connector.js")

function UploadVideoOrImage(form:any){
    // get file path
    try{
        console.log(form)
        s3.upload("video-crime-miner-video-test-bucket", form).then((response: any) => {
            console.log(response)
        })
    } catch (error){
        console.log(error)
    }
    // call upload in S3Connector with that file path

}
