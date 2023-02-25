import { mockClient } from 'aws-sdk-client-mock'
import { S3Client, CreateBucketCommand, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } from '@aws-sdk/client-s3'
import { createBucket, listBuckets, listObjects, getObjects, uploadFrontEndClient, removeObject } from '../../src/interfaces/video-storage/s3Connector'

const s3Mock = mockClient(S3Client)

// createBucket function test
describe('createBucket function', () => {
  s3Mock.on(CreateBucketCommand).resolves({})
  it('Should return a response after sending a request to create bucket', async () => {
    const res = await createBucket('example bucket name')
    expect(res).toBeTruthy()
  })
})

// listBucket function test
describe('listBuckets function', () => {
  s3Mock.on(ListBucketsCommand).resolves({})
  it('Should return a list of buckets', async () => {
    const res = await listBuckets()
    expect(res).toBeTruthy()
  })
})

// listObjects function test
describe('listObjects function', () => {
  s3Mock.on(ListObjectsV2Command).resolves({})
  it('Should return a list of objects', async () => {
    const res = await listObjects('example bucket')
    expect(res).toBeTruthy()
  })
})

// getObjectFromS3 function test
describe('getObjectFromS3 function', () => {
  s3Mock.on(GetObjectCommand).resolves({})
  it('Should return successful response', async () => {
    const res = await getObjects('example bucket', 'filename.png')
    expect(res).toBeTruthy()
  })
})

// uploadWithFile function test
describe('uploadWithFile function', () => {
  const uint = new Uint8Array()
  s3Mock.on(PutObjectCommand).resolves({})
  it('Should return successful response', async () => {
    const res = await uploadFrontEndClient('example bucket', uint, {})
    expect(res).toBeTruthy()
  })
})

// removeObject function test
describe('removeObject function', () => {
	s3Mock.on(DeleteBucketCommand).resolves({})
	it('should return a successful response', async () => {
		const res = await removeObject('example bucket' , 'filename.png')
		expect(res).toBeTruthy()
	})
})