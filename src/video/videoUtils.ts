require("dotenv").config()
const rekognition = require("@aws-sdk/client-rekognition");

function getVideoOutput(){
    
    return "{}"
}


function sendRequest(){
    
    rekognition.compareFaces({}, function (err: { stack: any; }, data: any) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
    
    return "https://aws.com/"
}