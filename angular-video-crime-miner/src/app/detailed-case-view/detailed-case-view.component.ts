import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detailed-case-view',
  templateUrl: './detailed-case-view.component.html',
  styleUrls: ['./detailed-case-view.component.scss']
})
export class DetailedCaseViewComponent implements OnInit {

  private baseUrl = 'http://localhost:8000'
  private caseId!: string
  private caseInfo?: JSON
  private caseFiles?: JSON
  private caseOutputs?: JSON

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.caseId = this.route.snapshot.paramMap.get('caseId') || '1'
    this.requestCaseInfo().subscribe(res => {
      this.caseInfo = res
    })
    
    this.requestCaseFiles(this.caseFiles).subscribe(res => {
      this.caseFiles = res
    })
    
    var fileS3Names = this.caseFiles
    this.requestCaseOutputs(fileS3Names).subscribe(res => {
      this.caseOutputs = res
    })
  }

  public requestCaseInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases/${this.caseId}`)
  }

  public getCaseInfo(): any {
    return this.caseInfo
  }

  public requestCaseFiles(obj:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/case/${this.caseId}`)
  }

  public getCaseFiles(): any {
    return this.caseFiles
  }

  public requestCaseOutputs(obj:any): Observable<any> {
    var tmp = []
    for (var i = 0; i<obj.length; i++){ // Build array of file ids
      tmp.push(obj[i].s3_name)
    }
    var body = {files:tmp}

    return this.http.post(`${this.baseUrl}/labels/multifile/`, body)
  }

  public getCaseOutputs(): any {
    return this.caseOutputs
  }
}