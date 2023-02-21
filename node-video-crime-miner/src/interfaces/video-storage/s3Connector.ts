
import * as fs from 'fs'
import * as path from 'path'

import { S3Client, CreateBucketCommand, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

const region = process.env['REGION'] || 'REGION NOT DEFINED IN .ENV'
const accessKeyId = process.env['AWS_ACCESS_KEY_ID'] || 'AWS ACCESS KEY NOT DEFINED IN .ENV'
const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'] || 'AWS SECRET ACCESS KEY REGION NOT DEFINED IN .ENV'

const attributes = {
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
}

const client = new S3Client(attributes)

async function createBucket (bucketName: string) {
  /**
	 * Bucket name must be globally unique and must not contain spaces or uppercase letters.
	 * see rules for naming buckets: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
	 */

  try {
    const attributes = {
      Bucket: bucketName
    }
    const command = new CreateBucketCommand(attributes)
    const result = await client.send(command)
    return result.Location || { error: 'Bucket not created' }
  } catch (e) {
    console.log('error', e)
    return { error: e }
  }
}

async function listBuckets () {
  try {
    const attributes = {

    }
    const command = new ListBucketsCommand(attributes)
    const result = await client.send(command)
    return result.Buckets || { error: 'Could not retrieve buckets' }
  } catch (e) {
    console.log('error', e)
    return { error: e }
  }
}

async function listObjects (bucket: string) {
  try {
    const attributes = {
      Bucket: bucket
    }
    const command = new ListObjectsV2Command(attributes)
    const result = await client.send(command)
    return result.Contents || { error: 'Could not retrieve bucket contents for bucket: ' + bucket }
  } catch (e) {
    console.log('error', e)
    return { error: e }
  }
}

async function uploadCommandLine (bucket: string, file: string) {
  try {
    const fileStream = fs.createReadStream(file)
    const attributes = {
      Bucket: bucket,
      Key: path.basename(file),
      Body: fileStream
    }
    const command = new PutObjectCommand(attributes)
    const result = await client.send(command)
    return result || { error: 'Could not upload ' + file + ' to ' + bucket }
  } catch (e) {
    console.log('error', e)
    return { S3Error: e }
  }
}

async function uploadFrontEndClient (bucket: string, body: any, key: any) {
  var buffer = Buffer.concat([body])

  try {
    const attributes = {
      Bucket: bucket,
      Key: key,
      Body: buffer
    }
    const command = new PutObjectCommand(attributes)
    const result = await client.send(command)
    return result || { error: 'Could not upload ' + key + ' to ' + bucket }
  } catch (e) {
    console.log('error', e)
    return { error: e }
  }
}

async function getObjects (bucketName: any, file: any) {
  try {
    const attributes = {
      Bucket: bucketName,
      Key: file
    }
    const command = new GetObjectCommand(attributes)
    const response = await client.send(command)
    return response.Body || { e: 'Could not retrieve file from: ' + bucketName }
  } catch (e) {
    console.log('error', e)
    return { error: e }
  }
}

// Testing code
// listObjects("video-crime-miner-video-test-bucket") // an example
// listBuckets() //another example
// If you're getting 403 errors on these two lines ^^^ then contact Jacob Bishop on Slack to get AWS ACL access

export { createBucket, listBuckets, listObjects, uploadCommandLine, getObjects, uploadFrontEndClient }
