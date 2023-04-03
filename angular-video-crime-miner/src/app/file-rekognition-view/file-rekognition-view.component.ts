import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { VgApiService } from '@videogular/ngx-videogular/core'

@Component({
  selector: 'app-file-rekognition-view',
  templateUrl: './file-rekognition-view.component.html',
  styleUrls: ['../app.component.scss', './file-rekognition-view.component.scss'],
})
export class FileRekognitionViewComponent implements OnInit {

  private baseUrl = 'http://localhost:8000'
  private jobId!: string

  // placeholder for relevant keywords and case ID
  private keywordsParam!: string

  // relevant keywords for file batch
  private keywords!: string[]

  // unique id for case
  private caseId!: string

  private cloudfrontBaseUrl = 'https://dthqh9b9a8scb.cloudfront.net'

  // set of labels organized by video file of origin
  public labelsByFile!: any

  // tracks currently selected group of labels for each sort type
  public currentFile!: string
  public currentKeyword!: string

  // existing sort types for labels
  public labelSortTypes: string[] = ["byFile", "byKeyword"]

  // currently selected sort method
  public sortMethod!: string

  public st: any = ""

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  
  ngOnInit(): void {

    // extracts URL Param, list of keywords and last element is caseId
    this.keywordsParam = this.route.snapshot.paramMap.get('keywords') as string

    // assign full URL param, containing caseId at tail end
    this.keywords = this.keywordsParam.split(',')

    // remove caseId from tail end of keywords list, assign to this.caseId
    this.caseId = this.keywords.pop() as string

    // sets default sort method to byFile
    this.sortMethod = "byFile"

    // call magic webhook here, will give file_ids, and a structure that contains the labels organized by file_ids
    // used in html to generate label buttons via ngFor
    this.fetchLabelsForFiles(this.keywords).subscribe( res => {
      //console.log("Res: ", res.data)
      this.setLabelsByFile( res.data )
    } )

    //console.log("LabelsByFile: ", this.labelsByFile)

    

  }

  /* Video Player */
  public videoAttributes: any =
    {
      name: 'video',
      src: ' ',
      type: 'video/mp4'
    }

  public currentVideo = this.videoAttributes
  private videoFileName?: string
  private videoMetaData?: JSON
  private currentBorderBoxes: HTMLElement[] = []
  private rawVideoData: VgApiService = new VgApiService

  // event function when a label is selected,
  // sets label selected on page to this.selectedLabel
  // changes video src to appropriate file
  // seeks out timestamp in video and places border box if present
  public selectLabelDetection(label:any, file_id:string, timestamp:number, instances: any[]): void {
    this.selectedLabel = label
    console.log(label)
    this.setVideoPlayerSrcAndName(`${this.cloudfrontBaseUrl}/${file_id}`, "video")
    this.seekTimestampInVideo(timestamp, instances)
    const overlay = document.getElementById("overlay")!
    overlay.style.display = 'none'
  }

  public seekTimestampInVideo(timestamp:number, instances: any[]): void{
    // Change timestamp
    this.rawVideoData.seekTime(timestamp/1000, false)
    this.generateBoundingBoxes(instances)
  }

  public generateBoundingBoxes(labelInstances: any[]): void{
    // Remove old boxes
    this.currentBorderBoxes.forEach((elem) => {
      elem.parentElement?.removeChild(elem)
    })
    this.currentBorderBoxes = []
    var videoContainer: HTMLElement = document.getElementById('video-container')!
    // Loop through all instances and draw boxes
    for(let i = 0; i<labelInstances.length; i++){
      const newBox : HTMLElement = document.createElement("span")
      const boxinfo = labelInstances[i].BoundingBox
      const confidence = labelInstances[i].Confidence
      newBox.setAttribute("style", `top:${boxinfo.Top * 100}%;left:${boxinfo.Left * 100}%;width:${videoContainer!.getBoundingClientRect().width * boxinfo.Width}px;height:${videoContainer!.getBoundingClientRect().height * boxinfo.Height}px;`)
      newBox.style.borderColor = "blue"
      newBox.style.borderStyle = "double"
      newBox.style.position = "absolute"
      newBox.style.zIndex = "2"
      newBox.className = "bounding-box"
      newBox.innerHTML = this.prettifyConfidence(confidence)
      videoContainer.appendChild(newBox)
      this.currentBorderBoxes.push(newBox)
    }
    
  }

  loadVideoIntoPlayer(api: VgApiService) {
    this.rawVideoData = api
    this.rawVideoData.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVideo.bind(this))
    this.rawVideoData.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this))
  }

  nextVideo() {
    this.currentVideo = this.videoAttributes
  }
  initVideo() {
    this.rawVideoData.pause()
    //this.rawVideoData.seekTime(99999999, false)
  }

  public setVideoPlayerSrcAndName(newVideoSrc:string, newVideoName:string): void {
    this.videoAttributes.src = newVideoSrc
    this.videoAttributes.name = newVideoName
  }

  public getAssociatedFile(): string {
    return this.videoFileName!
  }

  /* Requests */
  public requestFileForID(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/file_for_job/${this.jobId}`)
  }

  public getJobId(): string {
    return this.jobId || 'Job ID Not Valid'
  }

  public setJobId(newJobId:string): void {
    this.jobId = newJobId
  }

  public getCaseId(): string {
    return this.caseId
  }

  public setCaseId(newCaseId:string): void {
    this.caseId = newCaseId
  }

  public getKeywords(): string[] {
    return this.keywords
  }

  public setKeywords(newKeywords:string[]): void {
    this.keywords = newKeywords
  }

  // event function triggered when user selects label group by File
  public setCurrentFile(selectedFile:string) {
    if (this.currentFile !== selectedFile) {
      this.currentFile = selectedFile
    }
    else {
      this.currentFile = ""
    }
    //this.currentFile = selectedFile
    console.log("Current File: ", this.currentFile)
  }

  // used for debugging purposes from html javascript chunks, Ex. '*ngFor="let keyword of this.getKeywords()' and <p> {{this.printThing(keyword)}} </p>
  public printThing(thing:any): void {
    console.log("Thing: ", thing)
  }

  // event function triggered when user selects label group by Keyword
  public setCurrentKeyword(selectedKeyword:string): void {
    if (this.currentKeyword !== selectedKeyword) {
      this.currentKeyword = selectedKeyword
    }
    else {
      this.currentKeyword = ""
    }
    //this.currentKeyword = selectedKeyword
    console.log("Current Keyword: ", this.currentKeyword)
  }

  // finds subset in labels for given selected keyword from any file in batch
  public scanLabelsForKeyword(keywordToScanFor:string) {
    var allLabelsofKeywords:any[] = []
    this.labelsByFile.forEach( (fileSegment:any) => {
      fileSegment.labels.Labels.forEach( (label:any) => {
        if (label.Label.Name === keywordToScanFor) {
          allLabelsofKeywords.push( { file_id: fileSegment.file_id, label: label} )
        }
      } )
    } )
    return allLabelsofKeywords
  }

  /* Request and handle labels */
  private labels?: JSON
  private labelTotal?: JSON

  public requestLabels(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/job/${this.jobId}`)
  }
  public fetchLabelsForFiles(labels:string[]): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/keywords/${labels.toString()}`)
  }
  public getLabelsByFile(): any {
    return this.labelsByFile
  }
  public setLabelsByFile(newLabels:any): void{
    this.labelsByFile = newLabels
  }
  public getLabels(): any {
    return this.labels
  }
  public setLabels(newLabels:JSON): void {
    this.labels = newLabels
  }
  public getLabelTotal(){
    return this.labelTotal
  }
  public setLabelTotal(newLabelTotal:JSON): void {
    this.labelTotal = newLabelTotal
  }

  // used by html to only render buttons during 'byFile' sorting when appropriate file is selected
  public checkAgainstCurrentFile(selectedFile:string): boolean {
    if (selectedFile === this.currentFile) {
      //console.log("")
      return true
    }
    return false
  }

  // used by html to only render buttons during 'byKeyword' sorting when appropriate keyword is selected
  public checkAgainstCurrentKeyword(selectedKeyword:string): boolean {
    if (selectedKeyword === this.currentKeyword) {
      //console.log("")
      return true
    }
    return false
  }

  // acceptable sort methods are 'byFile' and 'byKeyword'
  public setSortMethod(newSortMethod:string) {
    if (this.labelSortTypes.includes(newSortMethod)) {
      this.sortMethod = newSortMethod
    }
    
  }

  // gets currently selected sort method
  public getSortMethod() {
    return this.sortMethod
  }

    /* List of Labels Functionality */
    selectedLabel?: any
    public onSelectLabel(label: any): void{
      this.selectedLabel = label
      this.seekTimestampInVideo(label.Timestamp, label.Instances)
      const overlay = document.getElementById("overlay")!
      overlay.style.display = 'none'
    }
  
    public onDoubleClickLabel(label: any): void{
      // TODO: popup with more info about that specific label, and possibly looking into "adding it into evidence?" or something?
    }

  /* List of labels helper methods */
  // Shuffles object with labels from request into a more useful, cleaner, and shorter format
  public tablePrepper(obj:any){
    const result = obj.map(
      ({Timestamp, Label: {Confidence, Name, Instances} }: any) => 
      ({Name, Confidence, Timestamp, Instances}))
    return result
  }
  // Makes timestamp pretty from milliseconds number to hh:mm:ss string
  public prettifyTimestamp(timestamp:number): string{
    let seconds = Math.floor(timestamp/1000)
    let hours = Math.floor(seconds/3600)
    seconds -= hours * 3600
    let minutes = Math.floor(seconds/60)
    seconds -= minutes * 60
    return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0')
}
  // Makes confidence an integer and adds a percentage sign
  public prettifyConfidence(confidence:number): string{
    return Math.round(confidence).toString() + "%"
  }
  // Returns all label occurrences
  public sumTotalLabelOccurrences(obj:any){
    return obj.length //TODO: add more robust length calculator
  }

}