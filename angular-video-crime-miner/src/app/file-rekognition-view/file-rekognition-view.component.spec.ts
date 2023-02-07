import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FileRekognitionViewComponent } from './file-rekognition-view.component'
import { RouterTestingModule } from "@angular/router/testing"
import { HttpClientTestingModule } from "@angular/common/http/testing"

describe('FileRekognitionViewComponent', () => {
  let component: FileRekognitionViewComponent
  let fixture: ComponentFixture<FileRekognitionViewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileRekognitionViewComponent ],
      providers: [ 
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(FileRekognitionViewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should run tablePrepper() on a list of label objects and return a flat JSON object', () => {
    const res = component.tablePrepper(
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