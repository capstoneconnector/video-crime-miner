import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRekognitionViewComponent } from './file-rekognition-view.component';

describe('FileRekognitionViewComponent', () => {
  let component: FileRekognitionViewComponent;
  let fixture: ComponentFixture<FileRekognitionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileRekognitionViewComponent ]
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
