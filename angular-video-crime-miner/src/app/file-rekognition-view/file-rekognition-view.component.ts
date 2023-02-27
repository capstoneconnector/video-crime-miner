import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { VgApiService, VgMediaDirective } from '@videogular/ngx-videogular/core'

@Component({
  selector: 'app-file-rekognition-view',
  templateUrl: './file-rekognition-view.component.html',
  styleUrls: ['../app.component.scss', './file-rekognition-view.component.scss'],
})
export class FileRekognitionViewComponent implements OnInit {

  private baseUrl = 'http://localhost:8000'
  private jobId!: string

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '1'
    this.requestFileForID().subscribe(fileidname => {
      this.videoFileName = fileidname.data[0].fileId
      this.videoItems[0].src = this.CDN_WrapFileUrl(this.videoFileName)
      this.videoItems[0].name = this.videoFileName
    })
    this.requestLabels().subscribe(labels => {
      this.videoData = labels.data.VideoMetadata
      this.labels = this.tablePrepper(labels.data.Labels)
      this.labelTotal = this.sumTotalLabelOccurrences(this.labels)
    })
  }

  /* Video Player */
  public videoItems: Array<any> = [
    {
      name: 'video',
      src: ' ',
      type: 'video/mp4'
    }
  ]
  private activeIndex = 0
  public currentVideo = this.videoItems[this.activeIndex]

  private videoFileName?: string
  private videoData?: JSON
  private currentBorderBox: HTMLElement | null = null
  private data: any
  public seekTimestampInVideo(timestamp:number, boxinfo:any): void{
    this.data.seekTime(timestamp/1000)
    var containerForBox: HTMLElement | null = document.getElementById('containerforbox')
    this.currentBorderBox?.remove()
    const newBox : HTMLElement = document.createElement("span")

    newBox.setAttribute("style", `border-style:double;border-color:red;position:absolute;top:${boxinfo.Top * 100}%;left:${boxinfo.Left * 100}%;width:${containerForBox!.getBoundingClientRect().width * boxinfo.Width}px;height:${containerForBox!.getBoundingClientRect().height * boxinfo.Height}px;z-index:2;`)

    containerForBox!.appendChild(newBox)
    this.currentBorderBox = newBox
  }
  onPlayerReady(api: VgApiService) {
    this.data = api;
    this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVideo.bind(this));
    this.data.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
    
  }
  nextVideo() {
    this.activeIndex++
    if (this.activeIndex === this.videoItems.length) {
      this.activeIndex = 0
    }
    this.currentVideo = this.videoItems[this.activeIndex]
  }
  initVideo() {
    this.data.play()
    this.data.seekTime(99999999, false)
  }
  startPlaylistVdo(item: any, index: number) {
    this.activeIndex = index;
    this.currentVideo = item;
  }
  public getAssociatedFile(): string {
    return this.videoFileName!
  }
  public CDN_WrapFileUrl(filename:any): string {
    
    return `https://dthqh9b9a8scb.cloudfront.net/${filename}`
  }

  /* Requests */
  public requestFileForID(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/file_for_job/${this.jobId}`)
  }

  public getJobId(): string {
    return this.jobId || 'Route Not Valid'
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
  public getLabelTotal(){
    return this.labelTotal
  }

  /* List of labels helper methods */
  public tablePrepper(obj:any){
    var result = obj.map(
      ({Timestamp, Label:{Aliases, Categories, Confidence, Name, Parents, Instances }}:any) => 
      ({Name, Aliases, Parents, Categories, Confidence, Timestamp, Instances}))
    return result
  }
  public prettifyTimestamp(timestamp:number): string{
    let seconds = Math.floor(timestamp/1000)
    let hours = Math.floor(seconds/3600)
    let minutes = Math.floor(seconds/60)
    seconds = seconds - (hours * 3600) - (minutes * 60)
    return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0')
  }
  public prettifyConfidence(confidence:number): string{
    return Math.round(confidence).toString() + "%"
  }
  public sumTotalLabelOccurrences(obj:any){
    return obj.length
  }

  /* List of Labels Functionality */
  selectedLabel?: any
  public onSelectLabel(label: any): void{
    this.selectedLabel = label
    this.seekTimestampInVideo(label.Timestamp, label.Instances[0].BoundingBox)
  }

  public onDoubleClickLabel(label: any): void{
    // TODO: popup with more info about that specific label, and possibly looking into "adding it into evidence?" or something?
  }

}