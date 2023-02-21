export default class ChuqlabCase {

    private name: string
    private description: string
    private tags: string[]
    private notes: string[]
    private files: Array<ChuqlabFile>

    constructor(name: string, description: string, tags: string[] = [], notes: string[]= [], files: Array<ChuqlabFile> = []) {
        this.name = name
        this.description = description
        this.tags = tags
        this.notes = notes
        this.files = files
    }

    /* Getter Methods */
    public getName(): string{
        return this.name
    }

    public getDescription(): string{
        return this.description
    }

    public getTags(): string[]{
        return this.tags
    }

    public getNotes(): string[]{
        return this.notes
    }

    public getFiles(): Array<ChuqlabFile>{
        return this.files
    }

    /* Setter Methods */
    public setName(name:string): void{
        this.name = name
    }

    public setDescription(description:string): void{
        this.description = description
    }

    public setTags(tags:string[]): void{
        this.tags = tags
    }

    public setNotes(notes:string[]): void{
        this.notes = notes
    }

    public setFiles(files:Array<ChuqlabFile>): void{
        this.files = files
    }
}