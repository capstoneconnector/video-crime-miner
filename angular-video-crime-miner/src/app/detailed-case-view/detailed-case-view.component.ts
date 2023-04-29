import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { FileService } from '../file.service'
import { CognitoService } from '../cognito.service'
import { VgApiService } from '@videogular/ngx-videogular/core'


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

  private caseKeywords!: any

  private finishedKeywords: string[][] = []

  /* Popup */
  showPopup = false

  /* CARD 3 STUFF */
  selectedFiles?: FileList
  progress = 0
  currentFile?: File
  message = ''
  fileInfos?: Observable<any>

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, 
    private router: Router, private uploadService: FileService, private userService: CognitoService) { }

    // listener callback for new-label-detection component
  public onJobStartedEmission(emittedNum:string) {
    console.log("JOB STARTED")
    //this.router.navigateByUrl('/detailed-case-view/' + emittedNum)
    

    this.requestCaseInfo().subscribe(res => {

      this.setCaseInfo(res.data[0])

      if(this.caseInfo == undefined){
        this.setCaseInfo(JSON.parse("{}"))
      }

    })

    this.requestCaseFiles().subscribe(res => {

      this.requestCaseOutputs(this.caseFiles).subscribe(res =>{ // Must be nested because requestCaseOutputs relies on this.caseFiles, another subscription
        this.setCaseOutputs(res.data)
        console.log(this.getCaseOutputs())
        this.closeStartLabelJobPopup()

        this.requestDistinctKeywordsForCase( this.caseId ).subscribe(res => {
          this.setCaseKeywords( res.data )

          this.caseKeywords.forEach( (keywords:any) => {

            /* WANT TO REMOVE THIS I THINK */
            this.checkTagsJobSatus(keywords.tags).subscribe( (res:any) => {
                if (res.data === "finished") {
                  console.log("Adding to Finished Tags: ", keywords.tags)
                  this.addTagsToFinishedKeywords(keywords.tags)
                }
            } )
            /* END */ 


            this.openViewLabelJobsPopup()
          })

          
        } )

      })
    })

    
  }

  ngOnInit(): void {
    this.caseId = this.activatedRoute.snapshot.paramMap.get('caseId') || '1'
    
    // tracks class instance for using in async function repeatingTagsJobStatusCheck
    const masterThis: this = this 

    // this async function will repeatedly call itself every 5 seconds, as long as detailed-case-view page/component is open
    async function repeatingTagsJobStatusCheck() {

      // fetch Distinct sets of keywords used in video analysis jobs from db
      masterThis.requestDistinctKeywordsForCase( masterThis.caseId ).subscribe(async res => {
        
        // update local copy of distinct keywords
        masterThis.setCaseKeywords( res.data )

        // loop through distinct keywords
        masterThis.caseKeywords.forEach( async(keywords:any) => {
          
          // check status for each distinct set of keywords
          masterThis.checkTagsJobSatus(keywords.tags).subscribe( (res:any) => {
            
            // update list of distinct keywords that have finsihed jobs
            if (res.data === "finished") {

              masterThis.addTagsToFinishedKeywords(keywords.tags)
            }
            
          } )
          
        

      })

      // wait 5 seconds and recursively call repeatingTagsJobStatusCheck
      await new Promise( resolve => setTimeout(resolve, 5000) ) // 5000 milliseconds
      repeatingTagsJobStatusCheck()

    } )
    
  }

  // start recursive function
  repeatingTagsJobStatusCheck()

    this.requestCaseInfo().subscribe(res => {

      this.setCaseInfo(res.data[0])

      if(this.caseInfo == undefined){
        this.setCaseInfo(JSON.parse("{}"))
      }

    })

    this.requestCaseFiles().subscribe(res => {

      this.setCaseFiles(res.data)
      
      if(res.data.length == 0){
        this.showNewCasePopup = true
      }

      this.requestCaseOutputs(this.caseFiles).subscribe(res =>{ // Must be nested because requestCaseOutputs relies on this.caseFiles, another subscription
        this.setCaseOutputs(res.data)

      })
    })

    this.fileInfos = this.uploadService.getFiles()
  }

  public setCaseId(newCaseId:string): void {
    this.caseId = newCaseId
  }

  public getCaseId(): string {
	return this.caseId
  }

  public requestCaseInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases/${this.caseId}?user=${this.userService.getUsername().getValue()}`)
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

  // local copy of distinct keywords for awsoutput Table
  public getCaseKeywords(): any {
    return this.caseKeywords
  }

  public setCaseKeywords(newKeywords:any): void {
    this.caseKeywords = newKeywords
  }

  public requestCaseOutputs(obj:any): Observable<any> {
    var names = this.getFileS3Names(obj)
    var body:Object = {files: names}

    return this.http.post(`${this.baseUrl}/labels/multifile`, body)
  }

  // calls back-end webhook function to fetch all distinct keywords for label detection jobs
  public requestDistinctKeywordsForCase(caseId:string): Observable<any> {
    return this.http.get( `${this.baseUrl}/case/keywords/${caseId}` )
  }

  // calls back-end webhook function to check the status of all jobs associated with given keywords ('tags' column in db awsoutput table)
  public checkTagsJobSatus(tags:string[]): Observable<any> {
    
    return this.http.get( `${this.baseUrl}/labels/tags/status/${tags.toString()}` )
  }

  // checks if tags param is present in this.finishedKeywords, and adds them if they aren't
  public addTagsToFinishedKeywords(tags:string[]): void{
    if (!this.finishedKeywords.includes(tags)) {
      this.finishedKeywords.push(tags)
    }
  }

  // checks local copy of finished batch jobs for tags Param
  public checkForTagsInFinished(tags:string[]): boolean {
    return this.finishedKeywords.includes(tags)
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
      for (let i = 0; i<this.selectedFiles.length; i++)  {
        const file: File | null = this.selectedFiles.item(i)
        this.currentFile = file!

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
      this.getCaseFiles()
      this.closeUploadFilePopup()
	  this.ngOnInit()
    })
  }

  private resetInputs(): void{
    this.name = ""
    this.description = ""
    this.tags = ""
    this.notes = ""
    this.file = null
  }



  /* Clickable file methods */
  public selectedFile = ""
  public onSelectFile(file: any){
    this.selectedFile = file
  }

  private doubleClickTimeout: any = null;
  public onSingleClickFile(file: any, event: MouseEvent) {
	// Check if the double click event was already fired
	if (this.doubleClickTimeout) {
	  // If it was fired, cancel the timeout and return
	  clearTimeout(this.doubleClickTimeout);
	  this.doubleClickTimeout = null;
	  return;
	}
  
	// Set a timeout for 300ms to allow for a potential double click event
	this.doubleClickTimeout = setTimeout(() => {
	  const fileName = file.title;
	  const downloadUrl = `http://localhost:8000/files/download/${fileName}`;
  
	  fetch(downloadUrl)
		.then(response => response.blob())
		.then(blob => {
		  const url = window.URL.createObjectURL(new Blob([blob]));
		  const link = document.createElement('a');
		  link.href = url;
		  link.setAttribute('download', fileName);
		  document.body.appendChild(link);
		  link.click();
		  link.remove();
		})
		.catch(error => console.error(error));
  
	  // Reset the double click timeout
	  this.doubleClickTimeout = null;
	}, 300);
  }

 private cloudfrontBaseUrl = 'https://dthqh9b9a8scb.cloudfront.net'

  public onDoubleClickFile(file:any){
    this.showPlayVideoPopup = true
    this.setVideoPlayerSrcAndName(`${this.cloudfrontBaseUrl}/${file.storageServiceFileName}`, "video")

  }

  /* Clickable output methods */
  public selectedOutput=""
  public onSelectOutput(output: any){
    this.selectedOutput = output
    this.router.navigateByUrl('/file-rekognition-view/' + output.jobId)
  }

  // used for keywords checkbox form when creating new video analysis job
  public selectedKeywords = ""
  public onSelectKeywords(keywords: any) {
    this.selectedKeywords = keywords
    this.router.navigateByUrl( `/file-rekognition-view/${keywords.tags.toString() + ',' + this.caseId}` )
  }

  /* Popup for newly created case */
  showNewCasePopup = false
  closeNewCasePopup(){
    this.resetInputs()
    this.showNewCasePopup = false
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
    this.name = this.getCaseInfo().name
    this.tags = this.getCaseInfo().tags
    this.notes = this.getCaseInfo().notes
    this.description = this.getCaseInfo().description
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
  
  /* Play Video popup */
  showPlayVideoPopup = false
  private rawVideoData: VgApiService = new VgApiService
  public videoAttributes: any =
  {
    name: 'video',
    src: ' ',
    type: 'video/mp4'
  }
  public currentVideo = this.videoAttributes
  closePlayVideoPopup(){
    this.resetInputs()
    this.showPlayVideoPopup = false
  }
  loadVideoIntoPlayer(api: VgApiService) {
    this.rawVideoData = api
    this.rawVideoData.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVideo.bind(this))
  }
  initVideo() {
    this.rawVideoData.pause()
    //this.rawVideoData.seekTime(99999999, false)
  }
  public setVideoPlayerSrcAndName(newVideoSrc:string, newVideoName:string): void {
    this.videoAttributes.src = newVideoSrc
    this.videoAttributes.name = newVideoName
  }

  /* Edit Case Popup */
	description: string = ""
	tags: string = ""
	notes: string = ""

	editCase(name:string, description:string, tags:string , notes: string): void {
		if(name.length<3 || description.length<1 || tags.length < 1) {
			// TODO: add a new message that says the fields aren't filled out
			let message = "ERROR: Case name must be length 3 or more, and there must be a description"
			this.setFeedbackMessage(false, message)
			return
		  } else {
			var body = {
				name: name,
				description: description,
				tags: [tags],
				notes: [notes],
        username: this.userService.getUsername().getValue()
			  }
		  this.http.put(`${this.baseUrl}/update/cases/${this.caseId}`, body).subscribe((res:any) => {
			if(res.success){
			  this.resetInputs()
			  this.setFeedbackMessage(true)
			  this.closeEditCasePopup()
			  this.ngOnInit()
	  
			}else{
			  this.setFeedbackMessage(false, "ERROR: The case could not be created")
			}
		  })
	  }
  }

	/* User Message Feedback */
	public successMessage:string = ""
	public errorMessage:string = ""
	private setFeedbackMessage(success:boolean, message:string = ""): void{
	  if(success){
		this.errorMessage = ""
		this.successMessage = "Case Updated"
	  }else{
		this.successMessage = ""
		this.errorMessage = message
	  }
	}

	public deleteFiles() {
		console.log("Delete Button Clicked")
	}

}