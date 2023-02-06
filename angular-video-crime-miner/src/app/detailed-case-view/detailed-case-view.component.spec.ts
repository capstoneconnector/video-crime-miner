import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DetailedCaseViewComponent } from './detailed-case-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('DetailedCaseViewComponent', () => {
  let component: DetailedCaseViewComponent;
  let fixture: ComponentFixture<DetailedCaseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedCaseViewComponent ],
      providers: [
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
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
