require("dotenv").config()
const Rekognition = require('aws-sdk/client-rekognition')

function connect() {
	const region = process.env.AWS_BUCKET_REGION
	const accessKeyId = process.env.AWS_ACCESS_KEY
	const secretAccessKey = process.env.AWS_SECRET_KEY

	const rekognition = new Rekognition({
		region,
		accessKeyId,
		secretAccessKey
	})

	return rekognition

}

connect().CompareFaces()