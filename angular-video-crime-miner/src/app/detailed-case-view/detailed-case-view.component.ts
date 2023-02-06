import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { FileService } from '../file.service'


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

  /* CARD 3 STUFF */
  selectedFiles?: FileList
  progress = 0
  currentFile?: File
  message = ''
  fileInfos?: Observable<any>

  constructor(private http: HttpClient, private route: ActivatedRoute, private uploadService: FileService) { }



  ngOnInit(): void {
    this.caseId = this.route.snapshot.paramMap.get('caseId') || '1'
    this.requestCaseInfo().subscribe(res => {
      this.caseInfo = res
      if(this.caseInfo == undefined){
        this.caseInfo = JSON.parse("{}")
      }
    })

    this.requestCaseFiles().subscribe(res => {
      this.caseFiles = res
      this.requestCaseOutputs(this.caseFiles).subscribe(res =>{ // Must be nested because requestCaseOutputs relies on this.caseFiles, another subscription
        this.caseOutputs = res
      })
    })
    this.fileInfos = this.uploadService.getFiles()
  }

  public requestCaseInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases/${this.caseId}`)
  }

  public getCaseInfo(): any {
    return this.caseInfo
  }

  public requestCaseFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/case/${this.caseId}`)
  }

  public getCaseFiles(): any {
    return this.caseFiles
  }

  public requestCaseOutputs(obj:any): Observable<any> {
    var names = this.getFileS3Names(obj)
    var body:Object = {files: names}

    return this.http.post(`${this.baseUrl}/labels/multifile`, body)
  }

  public getCaseOutputs(): any {
    return this.caseOutputs
  }

  public getFileS3Names(obj:any){
    var result = []
    for(var i = 0; i < obj.length; i++) {
      var file = obj[i]
      result.push(file.s3_name)
      return result
    }
  }

  /* CARD 3 STUFF: */
  selectFile(event: any): void {
    this.selectedFiles = event.target.files
  }


  name: string = ''
  file: any
  upload(): void {
    this.progress = 0

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0)

    if (file) {
      this.currentFile = file

      let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
      let body = new URLSearchParams()

      let formData = new FormData()
      formData.set("name", this.name)
      //formData.set("case_id", this.caseId)
      body.append("data", this.file)
      body.append("case_id", this.caseId)

      this.http.post(this.baseUrl + "/upload", formData)

      this.uploadService.upload(this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total)
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message
            this.fileInfos = this.uploadService.getFiles()
          }
        },
        error: (err: any) => {
          console.log(err)
          this.progress = 0

          if (err.error && err.error.message) {
            this.message = err.error.message
          } else {
            this.message = 'Could not upload the file!'
          }

          this.currentFile = undefined
        }
      })
    }

      this.selectedFiles = undefined
    }
  }
}