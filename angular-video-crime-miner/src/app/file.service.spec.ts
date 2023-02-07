import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(FileService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('should call remove() without errors', () => {
    const res = service.remove("example")
    expect(res).toBeUndefined()
  })
})