import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-new-label-detection',
  templateUrl: './new-label-detection.component.html',
  styleUrls: ['./new-label-detection.component.scss']
})
export class NewLabelDetectionComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  private baseUrl = 'http://localhost:8000'
  private fileId! : string
  private fileInfo?: JSON
  private caseId!: number
  public caseInfo?: JSON
  private labels: string[] = []
  public textValue: string = ""
  public newLabelForm: FormGroup = new FormGroup({
    label: new FormControl("")
  })

  ngOnInit(): void {
    this.fileId = this.route.snapshot.paramMap.get('fileId') || '1'
    this.requestFileInfo().subscribe(res => {

      this.setFileInfo( res.data )
      this.setCaseId(res.data[0].case_id)

      this.requestCaseInfo().subscribe(res =>{ // Must be nested because requestCaseInfo() relies on this.caseId, set by another subscription
        
        this.setCaseInfo(res.data)

      })
    })
  }

  public getFileId(): string {
    return this.fileId
  }

  public setFileId(newFileId:string): void {
    this.fileId = newFileId
  }

  public getCaseId(): number {
    return this.caseId
  }

  public setCaseId(newCaseId:number): void {
    this.caseId = newCaseId
  }

  public getFileInfo(): any {
    return this.fileInfo
  }

  public setFileInfo(newFileInfo:JSON): void {
    this.fileInfo = newFileInfo
  }

  public getCaseInfo(): any {
    return this.caseInfo
  }

  public setCaseInfo(newCaseInfo:JSON): void {
    this.caseInfo = newCaseInfo
  }

  public getLabels(): string[] {
    return this.labels
  }

  public setLabels(newLabels:string[]): void {
    this.labels = newLabels
  }

  public requestFileInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/info/${this.fileId}`)
  }

  public requestCaseInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases/${this.caseId}`)
  }

  public addNewLabel(): void {
    //TODO: Data sanitization; we need to make sure only alphanumeric characters are there
    var label = this.newLabelForm.value.label
    this.labels.push(label)
    this.newLabelForm.reset()
    this.updateLabelList()
  }

  private updateLabelList(){
    var elem:HTMLElement = document.getElementById("labelsList")!
    elem.innerHTML = this.labels.toString()
  }

  public sendJobCreationRequest(): void {
    //this is how the json body should look
    /*
    {
      "labels": 
      [
          "Label1",
          "Label2",
          "Label3"
      ]
    }
    */
    var body:Object = {"labels": this.labels}
    this.http.post(`${this.baseUrl}/labels/file/${this.fileId}`, body).subscribe((res:any) => {
      if(res.jobId != undefined){
        this.router.navigateByUrl('/detailed-case-view/' + this.getCaseId())
      }
    })
  }

}