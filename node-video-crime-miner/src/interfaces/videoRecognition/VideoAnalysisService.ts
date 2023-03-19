import { startLabelDetection, collectLabelDetections, client } from './videoLabelUtils.js'

interface videoAnalysisService {


    // start job, returns object with jobID attribute
    startJob (videoName:string, labelFilters:string[]) : Promise<any>;

    // collect results for job, returns object 
    collectJobResults(labelDetectJobId:string): Promise<any>;

}

const rekog : videoAnalysisService = {



    startJob: function (videoName:string, labelFilters:string[], targetClient:any=client) : Promise<any> {
        return startLabelDetection(videoName, labelFilters, targetClient);
    },

    collectJobResults: function(labelDetectJobId:string, targetClient:any=client) : Promise<any> {
        return collectLabelDetections(labelDetectJobId, targetClient)
    }



}



function getVideoAnalysisService() {

	/*This function compares STORAGE_SERVICE variable from .env and returns the implementation(service) */

	let service = process.env['VIDEO_ANALYSIS_SERVICE'] || 'VIDEO ANALYSIS SERVICE NOT DEFINED IN .env'

	if (service == 'rekog' || service == 'Rekog' || service == 'REKOG' || service == 'Rekognition' || service == 'rekognition') {
		console.log("video-analysis service: Rekognition")
        return rekog
	}else{
		console.log("The video-analysis service in use is : " + service + ", which isn't known. SERVER NEEDS RESTART!")
		return
	}
}

/*Get Storage Service variable from env*/
let vidService = getVideoAnalysisService()



export {vidService}