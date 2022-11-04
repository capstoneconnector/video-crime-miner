require("dotenv").config()
const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const path = require('path')

  function connect() {
	const region = process.env.AWS_BUCKET_REGION
	const accessKeyId = process.env.AWS_ACCESS_KEY
	const secretAccessKey = process.env.AWS_SECRET_KEY

	const s3 = new S3({
		region,
		accessKeyId,
		secretAccessKey
	})

	return s3

}


 async function listBuckets(){
	try {
		const response = await connect().listBuckets().promise()
		return response.Buckets
		
	} catch (e) {

		console.log('error')
	}
 }

 async function listObjects(bucket:string) {

	try {
		const response = await connect().listObjectsV2({
		Bucket: bucket
		}).promise();
	
		return response
	
	} catch (e) {
		console.log('error' , e)
	}
}

 function upload(bucket:string, file:string) {

	var uploadParams = {Bucket: bucket, Key: "", Body:""}
	var fileStream = fs.createReadStream(file);

	fileStream.on('error', function(err:any) {
  	console.log('File Error', err);
	});

	uploadParams.Body = fileStream
	uploadParams.Key = path.basename(file)

	 connect().upload(uploadParams, function(e:any, data:any) {
		if (e) {
			console.log("error", e)
		} if (data) {
			console.log("Upload Success", data.Location)
		}
	})
	
 }

 //upload("mt-test-uploads/test_images/","beach.jpg")



export {listBuckets, listObjects, upload, connect}