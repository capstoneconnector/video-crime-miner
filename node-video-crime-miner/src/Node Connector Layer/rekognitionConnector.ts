// Angular-Video Connector Module

// TODO: Figure out how to connect this to the frontend

async function UploadVideo(form:any){
    // TODO: Allow user to upload Video to AWS
    //return null
    var url = ""
    var content = ""

    const response = await fetch(url, {
        method: 'POST',
        body: content,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} })
      
    if (!response.ok) {
        /* Handle */ 
    }
    
    // If you care about a response:
    if (response.body !== null) {
        // body is ReadableStream<Uint8Array>
        // parse as needed, e.g. reading directly, or
        const asString = ""//new TextDecoder("utf-8").decode(response.body);
        // and further:
        const asJSON = JSON.parse(asString);  // implicitly 'any', make sure to verify type on runtime.
        return asJSON
    }
}

export { UploadVideo }