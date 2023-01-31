import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedCaseViewComponent } from './detailed-case-view.component';

describe('DetailedCaseViewComponent', () => {
  let component: DetailedCaseViewComponent;
  let fixture: ComponentFixture<DetailedCaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedCaseViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedCaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
