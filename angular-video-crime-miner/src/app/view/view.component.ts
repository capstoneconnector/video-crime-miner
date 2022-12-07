import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  private baseUrl = 'http://localhost:8000';
  private caseList: string[] = new Array<string>();
  private caseList$: Subject<string[]> = new Subject<string[]>();

  caseInfos?: Observable<any>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.caseInfos = this.getCases()
  }

  public getCases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases`)
  }
}