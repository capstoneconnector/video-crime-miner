import { ComponentFixture, inject, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { DetailedCaseViewComponent } from './detailed-case-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http'


describe('DetailedCaseViewComponent', () => {
  
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let detCaseViewComp: DetailedCaseViewComponent;

  beforeEach(() => {
    //Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        DetailedCaseViewComponent
        
      ]
    });

    //Instantiates HttpClient, HttpTestingController and EmployeeService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    detCaseViewComp = TestBed.inject(DetailedCaseViewComponent);

  })

    

    afterEach(() => {
      httpTestingController.verify(); //Verifies that no requests are outstanding
    });

  //Test case requestCaseInfo
  it('requestCaseInfo(): should return basic info for a case ', () => {
    
    var reqCaseId:string = "1"

    var expReq = { 
        name: "name", 
        description: "description", 
        tags: "tags", 
        notes: "notes"
       }

       detCaseViewComp.setCaseId(reqCaseId)

    detCaseViewComp.requestCaseInfo().subscribe(
      (data:any) => {
        expect(data).toEqual(expReq)
        detCaseViewComp.setCaseInfo(data)
      } // 
    );

    // addEmploye should have made one request to POST employee
    const req = httpTestingController.expectOne('http://localhost:8000/cases/'+ String(reqCaseId));
    expect(req.request.method).toEqual('GET');

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq });
    req.event(expectedResponse);

    // expect detCaseViewComp.getCaseInfo() === expReq
      expect(detCaseViewComp.getCaseInfo()).toEqual(expReq)
  });

  //Test case requestCaseFiles
  it('requestCaseFiles(): should return info for file related to given case ', () => {
    
    var reqCaseId:string = "1"

    var expReq = { 
        storageServiceFileName: "[DEMO] Real Crime Video.mp4",
        title: "gas station robbery security camera footage",
        notes: "no notes",
        caseId: 1,
        labelOutputs: []
       }

       detCaseViewComp.setCaseId(reqCaseId)

    detCaseViewComp.requestCaseFiles().subscribe(
      (data:any) => { 
        expect(data).toEqual(expReq)
        detCaseViewComp.setCaseFiles(data)
      } // 

    );

    // addEmploye should have made one request to POST employee
    const req = httpTestingController.expectOne('http://localhost:8000/files/case/'+ String(reqCaseId));
    expect(req.request.method).toEqual('GET');

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq });
    req.event(expectedResponse);

    // expect detCaseViewComp.getCaseFiles() === expReq
    expect(detCaseViewComp.getCaseFiles()).toEqual(expReq)
  });


  //Test case getFileS3Names
  it('getFileS3Names(): should return names of files from object ', () => {
    
    // mocked response from requestCaseFiles
    var objWithName:any = [ { dummyAttribute: "empty0", storageServiceFileName: "0.mp4" }, { dummyAttribute: "empty1", storageServiceFileName: "1.mp4" } ]

    // expect an array of the string values in objWithName
    var filenames = detCaseViewComp.getFileS3Names(objWithName)

    // check 
    expect(filenames).toEqual( [ "0.mp4", "1.mp4" ] )
    
  });


  //Test case requestCaseOutputs
  it('requestCaseOutputs(obj:any): should return video analysis info for file related to given case ', () => {
    
    var reqCaseId:string = "1"

    var expReq = {
        jobId: "345ab033645bdc304e2b3453c84936ffac82969d0265e078c01f491921b34521",
        fileId: "horse11.mp4",
        tags: [
            "Horse"
        ]
       }

       detCaseViewComp.setCaseId(reqCaseId)

    detCaseViewComp.requestCaseOutputs({ storageServiceFileName: "horse11.mp4" }).subscribe(
      (data:any) => { 
        expect(data).toEqual(expReq)
        detCaseViewComp.setCaseOutputs(data)
      } // 
    );

    // addEmploye should have made one request to POST employee
    const req = httpTestingController.expectOne('http://localhost:8000/labels/multifile');
    expect(req.request.method).toEqual('POST');

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq });
    req.event(expectedResponse);

      // expect detCaseViewComp.getCaseOutputs() === expReq
      expect(detCaseViewComp.getCaseOutputs()).toEqual(expReq)

  });



});
