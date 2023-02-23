export default class ChuqlabLabelOutput { 
    
    private jobId: string
    private result: {}
    private fileId: string
    private tags: string[]

    constructor(jobId: string, result: {}, fileId: string, tags: string[]) {
        this.jobId = jobId
        this.result = result
        this.fileId = fileId
        this.tags = tags
    }

    /* Getter Methods */
    public getJobId(): string {
        return this.jobId
    }

    public getResult(): {} {
        return this.result
    }

    public getFileId(): string{
        return this.fileId
    }

    public getTags(): string[]{
        return this.tags
    }

    /* Setter Methods */
    public setJobId(jobId:string): void {
        this.jobId = jobId
    }

    public setResult(result:string): void {
        this.result = result
    }

    public setFileId(fileId:string): void {
        this.fileId = fileId
    }

    public setTags(tags:string[]): void {
        this.tags = tags
    }
}