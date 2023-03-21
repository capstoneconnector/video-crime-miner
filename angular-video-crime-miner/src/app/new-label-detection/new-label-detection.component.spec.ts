import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http'
import { NewLabelDetectionComponent } from './new-label-detection.component';



import { ActivatedRoute, Router } from '@angular/router'

describe('NewLabelDetectionComponent', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let newLabelDetectComp: NewLabelDetectionComponent;
  let router: Router;
  let routerTestingController: RouterTestingModule;

  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLabelDetectionComponent ],
      imports: [ 
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        NewLabelDetectionComponent
        
      ]
    })
    .compileComponents();

    spyOn(NewLabelDetectionComponent.prototype, 'emitJobSentToDetCaseView').and.callThrough();

    //Instantiates HttpClient, HttpTestingController and EmployeeService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router)
    routerTestingController = TestBed.inject(RouterTestingModule)
    newLabelDetectComp = TestBed.inject(NewLabelDetectionComponent);
  });

  it('sendJobCreationRequest(): should return valid job id ', () => {
    
    var reqCaseId:number = 1

    //const mockedEmissionToParent = spyOn ( newLabelDetectComp, "emitJobSentToDetCaseView" )

    var expReq:any = { data: { JobId: "exampleJobId" }}

       //newLabelDetectComp.setCaseId(reqCaseId)

      newLabelDetectComp.setCaseId(1)
      newLabelDetectComp.setSelectedFile("example.mp4")
      newLabelDetectComp.setLabels( ["exLabel1", "exLabel2"] )

      newLabelDetectComp.sendJobCreationRequest()
      

    //var body:Object = { "labels": newLabelDetectComp.getLabels() }

    // sendJobCreationRequest should have made one request to POST /labels/file/<fileId>
    const req = httpTestingController.expectOne(`http://localhost:8000/labels/file/example.mp4`);
    expect(req.request.method).toEqual('POST');

    // Expect server to return the response after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq });
    req.event(expectedResponse);

    // expect
    expect(newLabelDetectComp.emitJobSentToDetCaseView).toHaveBeenCalled()
  });

  it('should create', () => {
    expect(newLabelDetectComp).toBeTruthy();
  });


});
