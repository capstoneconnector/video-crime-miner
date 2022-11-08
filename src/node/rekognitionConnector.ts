// Angular-Video Connector Module
import { upload } from "../video/s3Connector.js"

export default ()= function UploadVideoOrImage(form:any){
    // get file path
    try{
        console.log(form)
        upload("video-crime-miner-video-test-bucket", form).then(response => {
            console.log(response)
        })
    } catch (error){
        console.log(error)
    }
    // call upload in S3Connector with that file path
}