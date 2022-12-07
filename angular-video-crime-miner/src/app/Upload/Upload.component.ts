import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService } from 'src/app/file.service';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

@Component({
 selector: 'app-upload',
 templateUrl: './upload.component.html',
 styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;
  private baseUrl = 'http://localhost:8000';



  constructor(private uploadService: FileService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles()
  }

  submitCase(data:any): Observable<HttpEvent<any>>{
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('tags', data.tags)
    console.log(formData)
    const req = new HttpRequest('POST', `${this.baseUrl}/cases`, formData)
    return this.http.request(req);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }
}