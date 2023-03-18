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

      this.setCaseInfo(res.data[0])

      if(this.caseInfo == undefined){
        this.setCaseInfo(JSON.parse("{}"))
      }

    })

    this.requestCaseFiles().subscribe(res => {

      this.setCaseFiles(res.data)

      this.requestCaseOutputs(this.caseFiles).subscribe(res =>{ // Must be nested because requestCaseOutputs relies on this.caseFiles, another subscription
        this.setCaseOutputs(res.data)

      })
    })
    this.fileInfos = this.uploadService.getFiles()
  }

  public setCaseId(newCaseId:string): void {
    this.caseId = newCaseId
  }

  public requestCaseInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases/${this.caseId}`)
  }

  public getCaseInfo(): any {
    return this.caseInfo
  }

  public setCaseInfo(newCaseInfo:JSON): void {
    this.caseInfo = newCaseInfo
  }

  public requestCaseFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/case/${this.caseId}`) // .subscribe() (data) => { this.caseFiles = data }
  }

  public getCaseFiles(): any {
    return this.caseFiles
  }

  public setCaseFiles(newCaseFiles:JSON): void {
    this.caseFiles = newCaseFiles
  }

  public requestCaseOutputs(obj:any): Observable<any> {
    var names = this.getFileS3Names(obj)
    var body:Object = {files: names}

    return this.http.post(`${this.baseUrl}/labels/multifile`, body)
  }

  public getCaseOutputs(): any {
    return this.caseOutputs
  }

  public setCaseOutputs(newCaseOutputs:JSON): void {
    this.caseOutputs = newCaseOutputs
  }

  public getFileS3Names(obj:any){
    var result = []
    for(var i = 0; i < obj.length; i++) {
      var file = obj[i]
      result.push(file.storageServiceFileName)
    }
    return result
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

        this.uploadService.upload(this.currentFile, this.caseId).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total)
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message
              this.fileInfos = this.uploadService.getFiles()
            }
          },
          error: (err: any) => {
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
    // Update case files by reloading page (probably bad practice but oh well!)
    this.requestCaseFiles().subscribe( async res => {
      const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))
      await delay(5000)
      document.location.reload()
    })
  }

  private resetInputs(): void{
    this.name = ""
    this.file = null
  }



  /* Clickable file methods */
  public selectedFile = ""
  public onSelectFile(file: any){
    this.selectedFile = file
  }
  public onDoubleClickFile(file:any){
    // TODO: add popup for detailed file view
  }

  /* Popup for upload file */
  showUploadFilePopup = false
  openUploadFilePopup(){
    this.showUploadFilePopup = true
  }
  closeUploadFilePopup(){
    this.resetInputs()
    this.showUploadFilePopup = false
  }

  /* Popup for edit case details */
  showEditCasePopup = false
  openEditCasePopup(){
    this.showEditCasePopup = true
  }
  closeEditCasePopup(){
    this.resetInputs()
    this.showEditCasePopup = false
  }

  /* Popup for view label detection jobs */
  showViewLabelJobsPopup = false
  openViewLabelJobsPopup(){
    this.showViewLabelJobsPopup = true
  }
  closeViewLabelJobsPopup(){
    this.resetInputs()
    this.showViewLabelJobsPopup = false
  }

    /* Popup for start new label detection job */
    showStartLabelJobPopup = false
    openStartLabelJobPopup(){
      this.showStartLabelJobPopup = true
    }
    closeStartLabelJobPopup(){
      this.resetInputs()
      this.showStartLabelJobPopup = false
    }
}