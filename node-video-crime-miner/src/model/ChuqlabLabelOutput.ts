class ChuqlabLabelOutput { 
    
    private _jobId: string
    private _result: {}
    private _fileId: string
    private _tags: string[]

    constructor(jobId: string, result: {}, fileId: string, tags: string[]) {
        this._jobId = jobId
        this._result = result
        this._fileId = fileId
        this._tags = tags
    }

    /* Getter Methods */
    public getJobId(): string {
        return this._jobId
    }

    public getResult(): {} {
        return this._result
    }

    public getFileId(): string{
        return this._fileId
    }

    public getTags(): string[]{
        return this._tags
    }

    /* Setter Methods */
    public setJobId(jobId:string): void {
        this._jobId = jobId
    }

    public setResult(result:string): void {
        this._result = result
    }

    public setFileId(fileId:string): void {
        this._fileId = fileId
    }

    public setTags(tags:string[]): void {
        this._tags = tags
    }
}