import { uploadCommandLine, listObjects } from '../interfaces/video-storage/s3Connector.js'
import { startVideoFacesDetection, getVideoFacesDetectionOutput } from '../interfaces/videoRecognition/videoFaceUtil.js'
import { startLabelDetection, getLabelDetectionResults, collectLabelDetections } from '../interfaces/videoRecognition/videoLabelUtils.js'
import * as reader from 'readline'

const bucketName = process.env['REKOG_BUCKET_NAME'] || 'AWS ROLE ARN NOT DEFINED IN .ENV'

const readline = reader.createInterface({
  input: process.stdin,
  output: process.stdout
})

function main () {
  const choices = '(1) Upload a file\n(2) Scan for faces in a video\n(3) Label Detection for Video\n(4) View my files\n(q) Quit'
  console.log('What would you like to do?')
  console.log(choices)

  readline.question('Choose an option: ', (x: string) => {
    resolveInput(x)
  })
}

function resolveInput (userInput: any) {
  if (userInput == 'q') {
    // exit the program
    process.exit()
  } else if (userInput == '1') {
    // upload a file
    readline.question('Input file path: ', (x: any) => {
      uploadCommandLine(bucketName, x).then((response: any) => {
        console.log(response)
      })
    })
  } else if (userInput == '2') {
    // scan video faces
    readline.question('Input AWS filename: ', (x: any) => {
      startVideoFacesDetection(bucketName, x).then((jobId: any) => {
        console.log(jobId)
        getVideoFacesDetectionOutput(jobId).then((response: any) => {
          console.log(response)
        })
      })
    })
  } else if (userInput == '3') {
    // label detection video
    readline.question('Input AWS filename: ', (x: any) => {
      const keywords: string[] = ['Horse'] // Enter keyword for filter
      startLabelDetection(bucketName, x, keywords).then((jobId: any) => {
        console.log(jobId)
        collectLabelDetections(jobId).then((response: any) => {
        })
      })
    })
  } else if (userInput == '4') {
    // view files
    listObjects(bucketName)
  } else {
    console.log('ERROR: invalid choice')
  }
}

main()
