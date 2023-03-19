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

    //Instantiates HttpClient, HttpTestingController and EmployeeService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router)
    routerTestingController = TestBed.inject(RouterTestingModule)
    newLabelDetectComp = TestBed.inject(NewLabelDetectionComponent);
  });

  it('sendJobCreationRequest(): should return valid job id ', () => {
    
    var reqCaseId:number = 1

    var expReq:any[] = [ 
      
    ]

       //newLabelDetectComp.setCaseId(reqCaseId)

      newLabelDetectComp.setCaseId(1)
      //newLabelDetectComp.setFileId("example.mp4")
      newLabelDetectComp.setLabels( ["exLabel1", "exLabel2"] )

      newLabelDetectComp.sendJobCreationRequest()
      

    //var body:Object = { "labels": newLabelDetectComp.getLabels() }

    // sendJobCreationRequest should have made one request to POST /labels/file/<fileId>
    //const req = httpTestingController.expectOne(`http://localhost:8000/labels/file/${newLabelDetectComp.getFileId()}`);
    //expect(req.request.method).toEqual('POST');

    // Expect server to return the response after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq });
    //req.event(expectedResponse);

    // expect
    /*const navArgs = routerTestingController.withRoutes
    expect(navArgs).toBe(`/detailed-case-view/${newLabelDetectComp.getCaseId()}`);*/
  });

  it('should create', () => {
    expect(newLabelDetectComp).toBeTruthy();
  });


});
