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
  private cloudfrontBaseUrl = 'https://dthqh9b9a8scb.cloudfront.net'

  public st: any = ""

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '1'
    this.requestFileForID().subscribe(res => {
      this.setVideoPlayerSrcAndName( `${this.cloudfrontBaseUrl}/${res.data[0].fileId}`, this.videoAttributes.name )
    })
    this.requestLabels().subscribe(labels => {
      this.videoMetaData = labels.data.VideoMetadata
      this.labels = this.tablePrepper(labels.data.Labels[0]) // Only first 20 labels for now until we figure out pagination
      this.setLabelTotal(this.sumTotalLabelOccurrences(this.labels))
      this.st = JSON.stringify(this.labels)
    })
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
    this.rawVideoData.play()
    this.rawVideoData.seekTime(99999999, false)
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

  /* Request and handle labels */
  private labels?: JSON
  private labelTotal?: JSON

  public requestLabels(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/job/${this.jobId}`)
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
    let minutes = Math.floor(seconds/60)
    seconds = seconds - (hours * 3600) - (minutes * 60)
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