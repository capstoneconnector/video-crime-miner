
/* Backend S3 Storage Service imports */
import { listObjects, getObjects, uploadFrontEndClient, removeObject } from './s3Connector.js'
interface StorageService {


	listObjects(source: string /*parameter type*/): any /*return type*/;

	upload(source: string, body: any, filename:any): any;

	getObject(source:string, file: any):  any;

	removeObject(source:string, file:any): any;

	/* ADD more functions a storage serivce has that we may need here*/
}

const s3 : StorageService = {
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
	removeObject: function (bucket: string, fileName: any) {
		removeObject(bucket, fileName)
	}

	/*Import implemented functions here separated by commas*/
}

/* FOR EXAMPLE PURPOSES:
Using interfaces we can implement add other cloud storage 
services like Google Cloud Storage or Azure easily.
*/

const azure : StorageService = {
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

function getStorageService(): StorageService {

	/*This function compares STORAGE_SERVICE variable from .env and returns the implementation(service) */

	let service = process.env['STORAGE_SERVICE'] || 'STORAGE SERVICE NOT DEFINED IN .env'

	if (service == 's3' || service == 'S3' || service == 'aws_s3' || service == 'AWS_S3') {
		console.log("video-storage service: S3")
		return s3

	} else if (service == 'azure' || service == 'Azure') {
		console.log("video-storage service: Azure")
		return azure

	}else{
		console.log("The video-storage service in use is : " + service + ", which isn't known. SERVER NEEDS RESTART!")
		return
	}
}

/*Get Storage Service variable from env*/
let storageService = getStorageService()

export { storageService }