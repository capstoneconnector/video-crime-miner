import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

@Component({
 selector: 'app-upload',
 templateUrl: './upload.component.html',
 styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  fileInfos?: Observable<any>;
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  // On file Select
  onChange(event:any) {
	this.file = event.target.files[0];
}

  submitCase(data:any): void{
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
    let options = {headers:headers}
    let body = new URLSearchParams()
    body.append('name', data.name)
    body.append('description', data.description)
    body.append('tags', data.tags)
    const req = this.http.post(`${this.baseUrl}/cases`, body.toString(), options)
    req.subscribe()
  }

  name: string = ''
  file: any

  getName(name: string) {
	this.name = name
  }

  getFile(event:any) {
	this.file = event.target.files[0]
  }

  upload(): void {

	let formData = new FormData();
	formData.set("name", this.name)
	formData.set("file", this.file)

	this.http
	.post(this.baseUrl + "/upload", formData)
	.subscribe((response:any) => {})
    
  }
}