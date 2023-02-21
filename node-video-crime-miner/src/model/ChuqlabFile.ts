class ChuqlabFile { 
    
    private _storageServiceFileName: string
    private _title: string
    private _notes: string[]
    private _caseId: number
    private _labelOutputs: Array<ChuqlabLabelOutput>

    constructor(storageServiceFileName: string, title: string = storageServiceFileName, notes: string[] = [], caseId: number,
        labelOutputs: Array<ChuqlabLabelOutput> = []) {
        this._storageServiceFileName = storageServiceFileName
        this._title = title
        this._notes = notes
        this._caseId = caseId
        this._labelOutputs = labelOutputs
    }

    /* Getter Methods */
    public getStorageServiceFileName(): string {
        return this._storageServiceFileName
    }

    public getTitle(): string {
        return this._title
    }

    public getNotes(): string[] {
        return this._notes
    }

    public getCaseId(): number {
        return this._caseId
    }
    
    public getLabelOutputs(): Array<ChuqlabLabelOutput>{
        return this._labelOutputs
    }

    /* Setter Methods */
    public setStorageServiceFileName(storageServiceFileName:string): void {
        this._storageServiceFileName = storageServiceFileName
    }

    public setTitle(title:string): void {
        this._title = title
    }

    public setNotes(notes:string[]): void {
        this._notes = notes
    }

    public setCaseId(caseId: number): void {
        this._caseId = caseId
    }
    public setLabelOutputs(labelOutputs: Array<ChuqlabLabelOutput>): void {
        this._labelOutputs = labelOutputs
    }
}