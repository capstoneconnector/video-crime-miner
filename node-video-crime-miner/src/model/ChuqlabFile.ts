import ChuqlabLabelOutput from "./ChuqlabLabelOutput"

export default class ChuqlabFile { 
    
    private storageServiceFileName: string
    private title: string
    private notes: string[]
    private caseId: number
    private labelOutputs: Array<ChuqlabLabelOutput>

    constructor(storageServiceFileName: string, title: string = storageServiceFileName, notes: string[] = [], caseId: number,
        labelOutputs: Array<ChuqlabLabelOutput> = []) {
        this.storageServiceFileName = storageServiceFileName
        this.title = title
        this.notes = notes
        this.caseId = caseId
        this.labelOutputs = labelOutputs
    }

    /* Getter Methods */
    public getStorageServiceFileName(): string {
        return this.storageServiceFileName
    }

    public getTitle(): string {
        return this.title
    }

    public getNotes(): string[] {
        return this.notes
    }

    public getCaseId(): number {
        return this.caseId
    }
    
    public getLabelOutputs(): Array<ChuqlabLabelOutput>{
        return this.labelOutputs
    }

    /* Setter Methods */
    public setStorageServiceFileName(storageServiceFileName:string): void {
        this.storageServiceFileName = storageServiceFileName
    }

    public setTitle(title:string): void {
        this.title = title
    }

    public setNotes(notes:string[]): void {
        this.notes = notes
    }

    public setCaseId(caseId: number): void {
        this.caseId = caseId
    }
    public setLabelOutputs(labelOutputs: Array<ChuqlabLabelOutput>): void {
        this.labelOutputs = labelOutputs
    }
}