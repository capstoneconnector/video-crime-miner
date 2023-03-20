import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FileRekognitionViewComponent } from './file-rekognition-view.component'
import { RouterTestingModule } from "@angular/router/testing"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http'

describe('FileRekognitionViewComponent', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let fileRekViewComp: FileRekognitionViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileRekognitionViewComponent ],
      providers: [ 
        FileRekognitionViewComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents()

    //Instantiates HttpClient, HttpTestingController and EmployeeService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    fileRekViewComp = TestBed.inject(FileRekognitionViewComponent);
  })

  it('should create', () => {
    expect(fileRekViewComp).toBeTruthy()
  })

  it('should run tablePrepper() on a list of label objects and return a flat JSON object', () => {
    const res = fileRekViewComp.tablePrepper(
      [{
      "Label": {
          "Aliases": [
              {
                  "Name": "Human"
              }
          ],
          "Categories": [
              {
                  "Name": "Person Description"
              }
          ],
          "Confidence": 97.5456771850586,
          "Instances": [
              {
                  "BoundingBox": {
                      "Height": 0.16393329203128815,
                      "Left": 0.7162388563156128,
                      "Top": 0.12068342417478561,
                      "Width": 0.030095195397734642
                  },
                  "Confidence": 97.83622741699219
              },
              {
                  "BoundingBox": {
                      "Height": 0.2557867467403412,
                      "Left": 0.6801146268844604,
                      "Top": 0.06833687424659729,
                      "Width": 0.025330115109682083
                  },
                  "Confidence": 71.76848602294922
              }
          ],
          "Name": "Person",
          "Parents": []
      },
      "Timestamp": 0
  },]
  )
    //expect(res).toEqual([{ Name: 'Person', Aliases: 'Human', Parents: 'Human', Categories: 'Person Description', Confidence: 97.5456771850586, Timestamp: 0, length: 2 }])
    expect(res).toBeTruthy()
  })

  /*
  it('requestFileForID(): should receive file id and set video player src accordingly ', () => {
    
    var reqCaseId:string = "345ab033645bdc304e2b3453c84936ffac82969d0265e078c01f491921b34521"

    var expReq = {data:  [{
          fileId: "horse11.mp4"
      },] }

      fileRekViewComp.setJobId(reqCaseId)
      
      fileRekViewComp.requestFileForID().subscribe(
        (data:any) => {
            expect(data).toEqual(expReq)
            fileRekViewComp.setVideoFileName(data.data[0].fileId)
            fileRekViewComp.setVideoPlayerSrcAndName( fileRekViewComp.CDN_WrapFileUrl(fileRekViewComp.getVideoFileName()), fileRekViewComp.getVideoFileName() )
        } // 
      );

    // requestFileForID should have made one request to GET /labels/file_for_job/<caseId>
    const req = httpTestingController.expectOne( `http://localhost:8000/labels/file_for_job/${reqCaseId}` );
    expect(req.request.method).toEqual('GET');

    // Expect server to return the response after GET
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq });
    req.event(expectedResponse);

    // expect getVideoFileName === expReq.data[0].fileId
    // expect getVideoPlayerSrcAndName === [ `https://dthqh9b9a8scb.cloudfront.net/${expReq.data[0].fileId}`, expReq.data[0].fileId ]
        expect( fileRekViewComp.getVideoFileName() ).toEqual( expReq.data[0].fileId )
        expect( fileRekViewComp.getVideoPlayerSrcAndName() ).toEqual( [ `https://dthqh9b9a8scb.cloudfront.net/${expReq.data[0].fileId}`, expReq.data[0].fileId ] )

  })

  it('requestLabels() ', () => {
    
    var reqCaseId:string = "1"

    var expReq = { "data": { "Labels": [ {
                "Label": {
                    "Aliases": [
                        {
                            "Name": "Human"
                        }
                    ],
                    "Categories": [
                        {
                            "Name": "Person Description"
                        }
                    ],
                    "Confidence": 97.5456771850586,
                    "Instances": [
                        {
                            "BoundingBox": {
                                "Height": 0.16393329203128815,
                                "Left": 0.7162388563156128,
                                "Top": 0.12068342417478561,
                                "Width": 0.030095195397734642
                            },
                            "Confidence": 97.83622741699219
                        },
                        {
                            "BoundingBox": {
                                "Height": 0.2557867467403412,
                                "Left": 0.6801146268844604,
                                "Top": 0.06833687424659729,
                                "Width": 0.025330115109682083
                            },
                            "Confidence": 71.76848602294922
                        }
                    ],
                    "Name": "Person",
                    "Parents": []
                },
                "Timestamp": 0
            }], 
            "VideoMetadata": {
                "Codec": "h264",
                "ColorRange": "LIMITED",
                "DurationMillis": 15320,
                "Format": "QuickTime / MOV",
                "FrameHeight": 1080,
                "FrameRate": 25,
                "FrameWidth": 1920
            }
        }
    }

      fileRekViewComp.setJobId(reqCaseId)

      fileRekViewComp.requestLabels().subscribe(
        (data:any) => { 
            expect(data).toEqual(expReq) //  
            fileRekViewComp.setVideoData(  data.data.VideoMetadata )
            fileRekViewComp.setLabels( fileRekViewComp.tablePrepper(data.data.Labels) )
            fileRekViewComp.setLabelTotal( fileRekViewComp.sumTotalLabelOccurrences( fileRekViewComp.getLabels() ) )
    }
      );

    // requestLabels should have made one request to GET /labels/job/<caseId>
    const req = httpTestingController.expectOne( `http://localhost:8000/labels/job/${reqCaseId}` );
    expect(req.request.method).toEqual('GET');

    // Expect server to return the response after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Success', body: expReq });
    req.event(expectedResponse);

    expect(fileRekViewComp.getVideoData()).toEqual( expReq.data.VideoMetadata )
    expect( fileRekViewComp.getLabels() ).toEqual( fileRekViewComp.tablePrepper(expReq.data.Labels) )
    expect( fileRekViewComp.getLabelTotal() ).toEqual( fileRekViewComp.sumTotalLabelOccurrences( fileRekViewComp.tablePrepper(expReq.data.Labels) ) )

  })
  */

  /*
  it('should return seekTimestampInVideo() without errors'), () => {
    var mockedDocElement = document.createElement('div');
    //document.getElementById = mockedDocElement
    const res = component.seekTimestampInVideo(0, {
      "Height": 0.2557867467403412,
      "Left": 0.6801146268844604,
      "Top": 0.06833687424659729,
      "Width": 0.025330115109682083
  })
  }
  */
})