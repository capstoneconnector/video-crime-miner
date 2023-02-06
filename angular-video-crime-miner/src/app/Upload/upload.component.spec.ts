import { ComponentFixture, inject, TestBed } from '@angular/core/testing'
import { UploadComponent } from './upload.component'
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

  const getFileList = () => {
    const dt = new DataTransfer();
    dt.items.add(new File([], 'file.mp4'));
    return dt.files;
  };

  it('should run upload() and not return error', () => {
    component.selectedFiles = getFileList()
    const res = component.upload()
    expect(res).toBeUndefined()
  })

  it('should run submitCase() and not return error', () => {
    const res = component.submitCase({})
    expect(res).toBeUndefined()
  })
})