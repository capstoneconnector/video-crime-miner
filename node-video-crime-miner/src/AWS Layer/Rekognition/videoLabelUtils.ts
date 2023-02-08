
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from '@aws-sdk/client-rekognition'

const region = process.env['REGION'] || 'REGION NOT DEFINED IN .ENV'
const accessKeyId = process.env['AWS_ACCESS_KEY_ID'] || 'AWS ACCESS KEY NOT DEFINED IN .ENV'
const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] || 'AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV'
const bucketName = process.env['REKOG_BUCKET_NAME'] || 'REKOG BUCKET NAME NOT DEFINED IN .ENV'
const roleArn = process.env['AWS_ROLE_ARN'] || 'AWS ROLE ARN NOT DEFINED IN .ENV'

// Create the Rekognition Client
const attributes = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}
// console.log("VIDEOLABELUTILS ENV VAR ATTRIBUTES")
// console.log(attributes)
const client = new RekognitionClient(attributes)

async function startLabelDetection (videoName: string, labelFilters: string[] = [], clientToUse: RekognitionClient | any = client) {
  try {
    const attributes = {
      Video: {
        S3Object: {
          Name: videoName,
          Bucket: bucketName
        }
      },
      Features: ['GENERAL_LABELS'],
      Settings: {
        GeneralLabels: {
          LabelInclusionFilters: labelFilters // Enter terms to filter here
        }
      }
      /*
      NotificationChannel:{
        RoleArn: roleArn,
        SNSTopicArn: snsTopicArn
      },
      MinConfidence: 65
      */
    }
    // console.log(JSON.stringify(attributes))
    // Returns jobId to get when it's finished by getVideoFacesDetectionOutput
    const command = new StartLabelDetectionCommand(attributes)
    const result = await clientToUse.send(command)
    // console.log(JSON.stringify(result))
    return result.JobId || { error: "Couldn't start faces detection" }
  } catch (e) {
    console.log('error', e)
    return {
      startLabelsError: e
    }
  }
}

async function collectLabelDetections (labelDetectJobId: string, clientToUse: RekognitionClient | any = client) {
  // container for detected labels, will be returned at end of function
  const labelsDetected: any[] = []

  // fetch first batch of detected labels and recieve first token
  const dataCheck = await getLabelDetectionChunk(labelDetectJobId, undefined, clientToUse)

  // store first batch of labels
  labelsDetected.push(dataCheck.Labels)

  // tracks current token
  let tokenToUse = dataCheck.NextToken

  // the last batch will not have a token, ending this loop
  while (tokenToUse != undefined) {
    // fetch batch of labels using the current token
    await getLabelDetectionChunk(labelDetectJobId, tokenToUse, clientToUse).then(async (dataResponse) => {
      // store labels from new batch

      Object.keys(dataResponse).forEach(function (key) {
        if (key == 'Labels') {
          dataResponse[key].forEach(function (item: any) {
            // if (item["Name"] == "Fence") {
            console.log('\n\n' + JSON.stringify(item))
            // }
          })
          // console.log('Key : ' + key + ', Value : ' + JSON.stringify(dataResponse[key]))
        }
      })
      labelsDetected.push(dataResponse.Labels)

      // store new token
      tokenToUse = dataResponse.NextToken
    })
  }

  // array of Labels
  // see https://docs.aws.amazon.com/rekognition/latest/APIReference/API_GetLabelDetection.html
  // section 'Response Syntax', "Labels" Attribute
  return labelsDetected
}

async function getLabelDetectionChunk (id: string, nextToken: string | undefined = undefined, clientToUse: RekognitionClient | any = client) {
  try {
    const parameters = {
      JobId: id,
      MaxResults: 20, // number of objects labeled before recieving results
      NextToken: nextToken // token to recieve next batch

    }
    const command = new GetLabelDetectionCommand(parameters)
    let finished = false
    let result
    while (!finished) {
      result = await clientToUse.send(command)
      if (result.JobStatus == 'SUCCEEDED') {
        finished = true
        return result
      }
    }
    return result || { error: 'Could not get Label Detection Results' }
  } catch (e) {
    console.log('error', e)
  }
}

async function getLabelDetectionResults (id: string, clientToUse: RekognitionClient | any = client) {
  try {
    const parameters = {
      JobId: id,
      MaxResults: 20

    }
    const command = new GetLabelDetectionCommand(parameters)
    let finished = false
    let result
    while (!finished) {
      result = await clientToUse.send(command)
      if (result.JobStatus == 'SUCCEEDED') {
        finished = true
      }
    }
    return result || { error: 'Could not get Label Detection Results' }
  } catch (e) {
    console.log('error', e)
  }
}

export { startLabelDetection, getLabelDetectionResults, getLabelDetectionChunk, collectLabelDetections }
