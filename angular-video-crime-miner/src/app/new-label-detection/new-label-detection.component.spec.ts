import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NewLabelDetectionComponent } from './new-label-detection.component';

describe('NewLabelDetectionComponent', () => {
  let component: NewLabelDetectionComponent;
  let fixture: ComponentFixture<NewLabelDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLabelDetectionComponent ],
      imports: [ 
        RouterTestingModule,
        HttpClientTestingModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLabelDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call requestCaseInfo() and return without errors', () => {
    const res = component.requestCaseInfo()
    expect(res).toBeTruthy()
  })

  it('should call addNewLabel() and return without errors', () => {
    const res = component.addNewLabel()
    expect(res).toBeUndefined()
  })

  it('should call sendJobCreationRequest() and return without errors', () => {
    const res = component.sendJobCreationRequest()
    expect(res).toBeUndefined()
  })
});
