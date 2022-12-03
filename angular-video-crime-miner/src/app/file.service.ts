import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

@Injectable({
 providedIn: 'root'
})
export class FileService {
 private baseUrl = 'http://localhost:8000';
 private fileList: string[] = new Array<string>();
 private fileList$: Subject<string[]> = new Subject<string[]>();

 constructor(private http: HttpClient) { }

 public upload(file: File): Observable<HttpEvent<any>> {
  const formData: FormData = new FormData();

  formData.append('file', file, file.name);
  formData.append('test', 'hello world')

  const req = new HttpRequest('POST', `${this.baseUrl}/users/1/upload`, formData, {
    reportProgress: true,
    responseType: 'json'
  });

  return this.http.request(req);
}

public getFiles(): Observable<any> {
  return this.http.get(`${this.baseUrl}/files`);
}

 public download(fileName: string): void {

 }

 public remove(fileName: string): void {
   this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1);
   this.fileList$.next(this.fileList);
 }

 public list(): Observable<string[]> {
   return this.fileList$;
 }

 private addFileToList(fileName: string): void {
   this.fileList.push(fileName);
   this.fileList$.next(this.fileList);
 }
}