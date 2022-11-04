require("dotenv").config()
const S3 = require('aws-sdk/clients/s3')

const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

	const s3 = new S3({
		region,
		accessKeyId,
		secretAccessKey
	})

	export async function listObjects(bucket:string) {
		try {
			const response = await s3.listObjectsV2({
				Bucket: bucket
			}).promise();
	
			return response
	
		} catch (e) {
			console.log('our error' , e);
		}
	}
	