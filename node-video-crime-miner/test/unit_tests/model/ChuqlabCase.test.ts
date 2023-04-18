import ChuqlabFile from "../../../src/model/ChuqlabFile"
import ChuqlabCase from "../../../src/model/ChuqlabCase"

describe('ChuqlabCase', () => {
	const file1 = new ChuqlabFile('', '', [], 1, []);
	const file2 = new ChuqlabFile('', '', [], 1, []);
	const case1 = new ChuqlabCase(1, 'Test Case 1', 'Description for Test Case 1');
	const case2 = new ChuqlabCase(2, 'Test Case 2', 'Description for Test Case 2', ['tag1', 'tag2'], ['note1', 'note2'], [file1, file2]);
  
	it('should create a ChuqlabCase instance with default values', () => {
	  expect(case1.getName()).toBe('Test Case 1');
	  expect(case1.getDescription()).toBe('Description for Test Case 1');
	  expect(case1.getTags()).toEqual([]);
	  expect(case1.getNotes()).toEqual([]);
	  expect(case1.getFiles()).toEqual([]);
	});
  
	it('should create a ChuqlabCase instance with non-default values', () => {
	  expect(case2.getName()).toBe('Test Case 2');
	  expect(case2.getDescription()).toBe('Description for Test Case 2');
	  expect(case2.getTags()).toEqual(['tag1', 'tag2']);
	  expect(case2.getNotes()).toEqual(['note1', 'note2']);
	  expect(case2.getFiles()).toEqual([file1, file2]);
	});
  
	it('should set new values for name, description, tags, notes, and files', () => {
	  case1.setName('New Test Case Name');
	  case1.setDescription('New Description');
	  case1.setTags(['newTag']);
	  case1.setNotes(['newNote']);
	  case1.setFiles([file1]);
	  expect(case1.getName()).toBe('New Test Case Name');
	  expect(case1.getDescription()).toBe('New Description');
	  expect(case1.getTags()).toEqual(['newTag']);
	  expect(case1.getNotes()).toEqual(['newNote']);
	  expect(case1.getFiles()).toEqual([file1]);
	});
  });