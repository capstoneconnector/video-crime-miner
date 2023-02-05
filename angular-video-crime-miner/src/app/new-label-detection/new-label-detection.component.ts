import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-new-label-detection',
  templateUrl: './new-label-detection.component.html',
  styleUrls: ['./new-label-detection.component.scss']
})
export class NewLabelDetectionComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  private baseUrl = 'http://localhost:8000'
  private fileId! : string
  private fileInfo?: JSON
  private caseId!: number
  private caseInfo?: JSON

  ngOnInit(): void {
    this.fileId = this.route.snapshot.paramMap.get('fileId') || '1'
    this.requestFileInfo().subscribe(res => {
      this.fileInfo = res
      this.caseId = res.case_id
      this.requestCaseInfo().subscribe(res =>{ // Must be nested because requestCaseInfo() relies on this.caseId, set by another subscription
        this.caseInfo = res
      })
    })
  }

  public getCaseId(): number{
    return this.caseId
  }

  public getFileInfo(): any{
    return this.fileInfo
  }

  public getCaseInfo(): any{
    return this.caseInfo
  }

  public requestFileInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/info/${this.fileId}`)
  }

  public requestCaseInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases/${this.caseId}`)
  }

  public sendJobCreationRequest(): void {
    //this is how the json body should look
    /*
    {
      "labels": 
      [
          "Person",
          "Hat",
          "Gun"
      ]
    }
    */
  }

}
