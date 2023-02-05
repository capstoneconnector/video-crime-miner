import { ComponentFixture, inject, TestBed } from '@angular/core/testing'
import { UploadComponent } from './Upload.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { FormsModule } from '@angular/forms'

describe('UploadComponent', () => {
  let component: UploadComponent
  let fixture: ComponentFixture<UploadComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadComponent ],
      providers: [
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(UploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})