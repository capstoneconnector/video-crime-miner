import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ViewComponent } from './view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DetailedCaseViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewComponent ],
      providers: [
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it ( 'setFeedbackMessage', () => {

    component.setFeedbackMessage(false, "exampleMessage")

    expect(component.successMessage).toEqual("")
    expect(component.errorMessage).toEqual("exampleMessage")

    component.setFeedbackMessage(true, "exampleMessage")

    expect(component.successMessage).toEqual("Case Created")
    expect(component.errorMessage).toEqual("")

  } )

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
