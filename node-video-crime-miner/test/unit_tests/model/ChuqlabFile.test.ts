import ChuqlabLabelOutput from "../../../src/model/ChuqlabLabelOutput";
import ChuqlabFile from "../../../src/model/ChuqlabFile";


describe('ChuqlabFile', () => {

    let file: ChuqlabFile;
    let labelOutput1: ChuqlabLabelOutput;
    let labelOutput2: ChuqlabLabelOutput;

    beforeEach(() => {
        labelOutput1 = new ChuqlabLabelOutput('jobId', {}, 'fileId' , []);
        labelOutput2 = new ChuqlabLabelOutput('jobId', {}, 'fileId' , []);
        file = new ChuqlabFile('filename.txt', 'title', ['note1', 'note2'], 123, [labelOutput1, labelOutput2]);
    });

    it('should set the storage service file name', () => {
        file.setStorageServiceFileName('newname.txt');
        expect(file.getStorageServiceFileName()).toEqual('newname.txt');
    });

    it('should set the title', () => {
        file.setTitle('new title');
        expect(file.getTitle()).toEqual('new title');
    });

    it('should set the notes', () => {
        file.setNotes(['new note']);
        expect(file.getNotes()).toEqual(['new note']);
    });

    it('should set the case ID', () => {
        file.setCaseId(456);
        expect(file.getCaseId()).toEqual(456);
    });

    it('should set the label outputs', () => {
        const newLabelOutput = new ChuqlabLabelOutput('jobId', {}, 'fileId' , []);
        file.setLabelOutputs([newLabelOutput]);
        expect(file.getLabelOutputs()).toEqual([newLabelOutput]);
    });

    it('should get the storage service file name', () => {
        expect(file.getStorageServiceFileName()).toEqual('filename.txt');
    });

    it('should get the title', () => {
        expect(file.getTitle()).toEqual('title');
    });

    it('should get the notes', () => {
        expect(file.getNotes()).toEqual(['note1', 'note2']);
    });

    it('should get the case ID', () => {
        expect(file.getCaseId()).toEqual(123);
    });

    it('should get the label outputs', () => {
        expect(file.getLabelOutputs()).toEqual([labelOutput1, labelOutput2]);
    });
});