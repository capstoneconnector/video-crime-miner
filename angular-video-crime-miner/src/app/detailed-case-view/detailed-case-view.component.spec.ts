import { ComponentFixture, inject, TestBed, fakeAsync, flush } from '@angular/core/testing'
import { DetailedCaseViewComponent } from './detailed-case-view.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http'


describe('DetailedCaseViewComponent', () => {
  
  let httpClient: HttpClient
  let httpTestingController: HttpTestingController
  let detCaseViewComp: DetailedCaseViewComponent

  beforeEach(() => {
    //Configures testing app module
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        DetailedCaseViewComponent
        
      ]
    })

    //Instantiates HttpClient, HttpTestingController and Detailed Case View Component
    httpClient = TestBed.inject(HttpClient)
    httpTestingController = TestBed.inject(HttpTestingController)
    detCaseViewComp = TestBed.inject(DetailedCaseViewComponent)

  })

    

    afterEach(() => {
      httpTestingController.verify() //Verifies that no requests are outstanding
    })

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
      }
    )

    // requestCaseInfo should have made one request to GET /cases/<caseId>
    const req = httpTestingController.expectOne('http://localhost:8000/cases/'+ String(reqCaseId)+'?user=')
    expect(req.request.method).toEqual('GET')

    // Expect server to return the response after GET
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq })
    req.event(expectedResponse)

    // expect detCaseViewComp.getCaseInfo() === expReq
      expect(detCaseViewComp.getCaseInfo()).toEqual(expReq)
  })

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

    )

    // requestCaseFiles should have made one request to POST /files/case/<caseId>
    const req = httpTestingController.expectOne('http://localhost:8000/files/case/'+ String(reqCaseId))
    expect(req.request.method).toEqual('GET')

    // Expect server to return the response after GET
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq })
    req.event(expectedResponse)

    // expect detCaseViewComp.getCaseFiles() === expReq
    expect(detCaseViewComp.getCaseFiles()).toEqual(expReq)
  })


  //Test case getFileS3Names
  it('getFileS3Names(): should return names of files from object ', () => {
    
    // mocked response from requestCaseFiles
    var objWithName:any = [ { dummyAttribute: "empty0", storageServiceFileName: "0.mp4" }, { dummyAttribute: "empty1", storageServiceFileName: "1.mp4" } ]

    // expect an array of the string values in objWithName
    var filenames = detCaseViewComp.getFileS3Names(objWithName)

    // check 
    expect(filenames).toEqual( [ "0.mp4", "1.mp4" ] )
    
  })


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
    )

    // requestCaseOutputs should have made one request to POST /labels/multifile
    const req = httpTestingController.expectOne('http://localhost:8000/labels/multifile')
    expect(req.request.method).toEqual('POST')

    // Expect server to return the response after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq })
    req.event(expectedResponse)

      // expect detCaseViewComp.getCaseOutputs() === expReq
      expect(detCaseViewComp.getCaseOutputs()).toEqual(expReq)

  })

  it('editCase(name:string, description:string, tags:string , notes: string) should get a response and deal with it accordingly', () => {
    // blank name should change error message and return
    detCaseViewComp.editCase('', 'desc', 'notes', 'tags')
    expect(detCaseViewComp.errorMessage).toEqual('ERROR: Case name must be length 3 or more, and there must be a description')
    expect(detCaseViewComp.successMessage).toEqual("")

    // valid inputs should be sent
    detCaseViewComp.successMessage = ''
    detCaseViewComp.errorMessage = ''
    detCaseViewComp.editCase('name', 'desc', 'notes', 'tags')
    expect(detCaseViewComp.errorMessage).toEqual('')
    expect(detCaseViewComp.successMessage).toEqual('')
    const req = httpTestingController.expectOne('http://localhost:8000/update/cases/'+detCaseViewComp.getCaseId())
    expect(req.request.method).toEqual('PUT')
  })

  it('setFeedbackMessage(success:boolean, message:string = "") should change error and success messages', () => {
    detCaseViewComp.errorMessage = ""
    detCaseViewComp.successMessage = "";
    // since setFeedbackMessage is private, use as any to get around typescript errors! This makes us add explicit semicolons, so don't remove them!
    (detCaseViewComp as any).setFeedbackMessage(false, "example error");
    expect(detCaseViewComp.errorMessage).toEqual("example error");
    expect(detCaseViewComp.successMessage).toEqual("");
    (detCaseViewComp as any).setFeedbackMessage(true)
    expect(detCaseViewComp.errorMessage).toEqual("")
    expect(detCaseViewComp.successMessage).toEqual("Case Updated")
  })

  it('close popup functions should reset inputs', () => {
    detCaseViewComp.name, detCaseViewComp.description, detCaseViewComp.tags, detCaseViewComp.notes, detCaseViewComp.file = "a value"
    detCaseViewComp.closeEditCasePopup()
    expect(detCaseViewComp.name).toEqual("")
    expect(detCaseViewComp.description).toEqual("")
    expect(detCaseViewComp.tags).toEqual("")
    expect(detCaseViewComp.notes).toEqual("")
    expect(detCaseViewComp.file).toBeNull()

    detCaseViewComp.name, detCaseViewComp.description, detCaseViewComp.tags, detCaseViewComp.notes, detCaseViewComp.file = "a value"
    detCaseViewComp.closeStartLabelJobPopup()
    expect(detCaseViewComp.name).toEqual("")
    expect(detCaseViewComp.description).toEqual("")
    expect(detCaseViewComp.tags).toEqual("")
    expect(detCaseViewComp.notes).toEqual("")
    expect(detCaseViewComp.file).toBeNull()

    detCaseViewComp.name, detCaseViewComp.description, detCaseViewComp.tags, detCaseViewComp.notes, detCaseViewComp.file = "a value"
    detCaseViewComp.closeUploadFilePopup()
    expect(detCaseViewComp.name).toEqual("")
    expect(detCaseViewComp.description).toEqual("")
    expect(detCaseViewComp.tags).toEqual("")
    expect(detCaseViewComp.notes).toEqual("")
    expect(detCaseViewComp.file).toBeNull()

    detCaseViewComp.name, detCaseViewComp.description, detCaseViewComp.tags, detCaseViewComp.notes, detCaseViewComp.file = "a value"
    detCaseViewComp.closeViewLabelJobsPopup()
    expect(detCaseViewComp.name).toEqual("")
    expect(detCaseViewComp.description).toEqual("")
    expect(detCaseViewComp.tags).toEqual("")
    expect(detCaseViewComp.notes).toEqual("")
    expect(detCaseViewComp.file).toBeNull()
    
  })

  it('open popup function should show that popup', () => {

    detCaseViewComp.openStartLabelJobPopup()
    expect(detCaseViewComp.showStartLabelJobPopup).toEqual(true)

    detCaseViewComp.openUploadFilePopup()
    expect(detCaseViewComp.showUploadFilePopup).toEqual(true)

    detCaseViewComp.openViewLabelJobsPopup()
    expect(detCaseViewComp.showViewLabelJobsPopup).toEqual(true)
  })

  it('should create', () => {
    //expect(detCaseViewComp).toBeTruthy()
  })
})