
/* Backend S3 Storage Service imports */
import { listObjects, getObjects, uploadFrontEndClient } from '../AWS Layer/s3Connector.js'
interface storageService {
	listObjects(source: string /*parameter type*/): any /*return type*/;

	upload(source: string, body: any, filename:any): any;

	getObject(source:string, file: any):  any;

	removeObject(source:string, file:any): any;

	/* ADD more functions a storage serivce has that we may need here*/
}

const s3 : storageService = {
	// I only imported the functions we need for the angular client for now
	listObjects: function (bucket: string): any {
		listObjects(bucket);
	},

	upload: function (bucket: string, buffer: any, filename: any): any {
		uploadFrontEndClient(bucket, buffer, filename);
	},

	getObject: function (bucket: string, fileName: any): any {
		getObjects(bucket, fileName);
	}
	,
	removeObject: function (source: string, file: any) {
		throw new Error('Function not implemented.');
	}

	/*Import implemented functions here separated by commas*/
}

/* FOR EXAMPLE PURPOSES:
Using interfaces we can implement add other cloud storage 
services like Google Cloud Storage or Azure easily.
*/

const azure : storageService = {
	listObjects: function (source: string) {
		throw new Error('Function not implemented.');
	},
	upload: function (source: string, body: any, filename: any) {
		throw new Error('Function not implemented.');
	},
	getObject: function (source: string, file: any) {
		throw new Error('Function not implemented.');
	},
	removeObject: function (source: string, file: any) {
		throw new Error('Function not implemented.');
	}
}

function getStorageService() {

	/*This function compares STORAGE_SERVICE variable from .env and returns the implementation(service) */

	let service = process.env['STORAGE_SERVICE'] || 'STORAGE SERVICE NOT DEFINED IN .env'

	if (service == 's3' || 'S3' || 'aws_s3' || 'AWS_S3') {
		return s3

	} else if (service == 'azure' || 'Azure') {
		return azure

	}

	console.log("The Cloud Service in use is : " + service)
}

/*Get Storage Service variable from env*/
let envVariable = getStorageService()



export {envVariable}



