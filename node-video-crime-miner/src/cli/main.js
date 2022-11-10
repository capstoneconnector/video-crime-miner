"use strict";
exports.__esModule = true;
//var { fail } = require("assert")
var s3Connector_1 = require("../node/s3Connector");
var videoUtils_1 = require("../video/videoUtils");
var videoClient_1 = require("../video/videoClient");
//var { upload, listObjects } = require("../node/s3Connector")
//var { startVideoFacesDetection, getVideoFacesDetectionOutput } = require('../video/videoUtils')
//var { runLabelDetectionAndGetResults } = require('../video/videoClient')
var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
function main() {
    var choices = "(1) Upload a file\n(2) Scan for faces in a video\n(3) Label Detection for Video\n(4) View my files\n(q) Quit";
    console.log("What would you like to do?");
    console.log(choices);
    readline.question("Choose an option: ", function (x) {
        resolveInput(x);
    });
}
function resolveInput(userInput) {
    if (userInput == "q") {
        //exit the program
        process.exit();
    }
    else if (userInput == "1") {
        //upload a file
        readline.question("Input file path: ", function (x) {
            (0, s3Connector_1.upload)("video-crime-miner-video-test-bucket", x).then(function (response) {
                //console.log(response)
            });
        });
    }
    else if (userInput == "2") {
        //scan video faces
        readline.question("Input AWS filename: ", function (x) {
            (0, videoUtils_1.startVideoFacesDetection)("video-crime-miner-video-test-bucket", x).then(function (jobId) {
                (0, videoUtils_1.getVideoFacesDetectionOutput)(jobId);
            });
        });
    }
    else if (userInput == "3") {
        //label detection video
        console.log("This may take a while...");
        readline.question("Input AWS filename: ", function (x) {
            (0, videoClient_1.runLabelDetectionAndGetResults)("video-crime-miner-video-test-bucket", x).then(function (x) {
                //console.log(x)
            });
        });
    }
    else if (userInput == "4") {
        //view files
        (0, s3Connector_1.listObjects)("video-crime-miner-video-test-bucket");
    }
    else {
        console.log("ERROR: invalid choice");
    }
}
main();
