
/* Backend S3 Storage Service imports */
import { listObjects, getObjects, uploadFrontEndClient } from '../AWS Layer/s3Connector.js'

interface storageService {
	listObjects(source: string /*parameter type*/): any /*return type*/;

	upload(source: string, body: any, filename:any): any;

	getObject(source:string, file: any):  any;

	/* ADD more functions a storage serivce has that we may need here*/
}

const s3: storageService = {

	// I only imported the functions we need for the angular client for now
	listObjects: function (bucket: string): any {
		 listObjects(bucket);
	},

	upload: function (bucket: string, buffer: any, filename: any): any{
		uploadFrontEndClient(bucket, buffer, filename);
	},

	getObject: function (bucket: string, fileName: any): any{
		getObjects(bucket, fileName);
	}

	/*Import implemented functions here separated by commas*/
}

/* FOR EXAMPLE PURPOSES:
Using interfaces we can add other cloud storage 
services like Google Cloud Storage or Azure easily.
*/

var anotherStorageService : storageService = {
	listObjects: function (source: string) {
		throw new Error('Function not implemented.');
	},
	upload: function (source: string, body: any, filename: any) {
		throw new Error('Function not implemented.');
	},
	getObject: function (source: string, file: any) {
		throw new Error('Function not implemented.');
	}
}

export {s3}



