import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileRekognitionViewComponent } from './file-rekognition-view.component';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing"

describe('FileRekognitionViewComponent', () => {
  let component: FileRekognitionViewComponent;
  let fixture: ComponentFixture<FileRekognitionViewComponent>;

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
    .compileComponents();

    fixture = TestBed.createComponent(FileRekognitionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});