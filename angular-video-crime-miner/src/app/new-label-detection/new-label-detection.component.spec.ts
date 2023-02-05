import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLabelDetectionComponent } from './new-label-detection.component';

describe('NewLabelDetectionComponent', () => {
  let component: NewLabelDetectionComponent;
  let fixture: ComponentFixture<NewLabelDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLabelDetectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLabelDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
