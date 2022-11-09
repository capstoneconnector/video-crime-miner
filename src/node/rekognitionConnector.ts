// Angular-Video Connector Module
const upload = require("./s3Connector.js")

function UploadVideoOrImage(form:any){
    // get file path
    try{
        console.log(form)
        upload("video-crime-miner-video-test-bucket", form).then((response: any) => {
            console.log(response)
        })
    } catch (error){
        console.log(error)
    }
    // call upload in S3Connector with that file path
}