import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  private baseUrl = 'http://localhost:8000'

  caseInfos?: Observable<any>

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.requestCases().subscribe(res => {
      this.caseInfos = res.data
    })
  }

  public requestCases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases`)
  }

  public getCaseInfos(): any{
    return this.caseInfos
  }

}