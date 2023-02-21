class ChuqlabCase {

    private _name: string
    private _description: string
    private _tags: string[]
    private _notes: string[]
    private _files: Array<ChuqlabFile>

    constructor(name: string, description: string, tags: string[] = [], notes: string[]= [], files: Array<ChuqlabFile> = []) {
        this._name = name
        this._description = description
        this._tags = tags
        this._notes = notes
        this._files = files
    }

    /* Getter Methods */
    public getName(): string{
        return this._name
    }

    public getDescription(): string{
        return this._description
    }

    public getTags(): string[]{
        return this._tags
    }

    public getNotes(): string[]{
        return this._notes
    }

    public getFiles(): Array<ChuqlabFile>{
        return this._files
    }

    /* Setter Methods */
    public setName(name:string): void{
        this._name = name
    }

    public setDescription(description:string): void{
        this._description = description
    }

    public setTags(tags:string[]): void{
        this._tags = tags
    }

    public setNotes(notes:string[]): void{
        this._notes = notes
    }

    public setFiles(files:Array<ChuqlabFile>): void{
        this._files = files
    }
}