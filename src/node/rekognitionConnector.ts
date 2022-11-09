// Angular-Video Connector Module
//import upload from "../video/s3Connector.js"
//const upload = require("../video/s3Connector.js")
//import { upload } from "../video/s3Connector.js"
//var exports = {}
import { upload } from "../video/s3Connector.js"
//import * as something from "../video/s3Connector.js"

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

export {UploadVideoOrImage}
