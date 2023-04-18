import ChuqlabLabelOutput from "../../../src/model/ChuqlabLabelOutput";

describe('ChuqlabLabelOutput', () => {
	let chuqlabLabelOutput: ChuqlabLabelOutput;
  
	beforeEach(() => {
	  chuqlabLabelOutput = new ChuqlabLabelOutput(
		'job-id',
		{ label: 'positive', score: 0.9 },
		'file-id',
		['tag-1', 'tag-2']
	  );
	});
  
	it('should have a jobId property', () => {
	  expect(chuqlabLabelOutput.getJobId()).toBe('job-id');
	});
  
	it('should have a result property', () => {
	  expect(chuqlabLabelOutput.getResult()).toEqual({ label: 'positive', score: 0.9 });
	});
  
	it('should have a fileId property', () => {
	  expect(chuqlabLabelOutput.getFileId()).toBe('file-id');
	});
  
	it('should have a tags property', () => {
	  expect(chuqlabLabelOutput.getTags()).toEqual(['tag-1', 'tag-2']);
	});
  
	it('should be able to set the jobId property', () => {
	  chuqlabLabelOutput.setJobId('new-job-id');
	  expect(chuqlabLabelOutput.getJobId()).toBe('new-job-id');
	});
  
	it('should be able to set the fileId property', () => {
	  chuqlabLabelOutput.setFileId('new-file-id');
	  expect(chuqlabLabelOutput.getFileId()).toBe('new-file-id');
	});
  
	it('should be able to set the tags property', () => {
	  chuqlabLabelOutput.setTags(['tag-3', 'tag-4']);
	  expect(chuqlabLabelOutput.getTags()).toEqual(['tag-3', 'tag-4']);
	});
  });