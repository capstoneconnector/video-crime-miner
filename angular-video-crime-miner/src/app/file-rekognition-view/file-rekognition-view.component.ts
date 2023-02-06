import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { TranscribeService } from 'aws-sdk'
import { json } from 'stream/consumers'

import { VgApiService, VgMediaDirective } from '@videogular/ngx-videogular/core'

@Component({
  selector: 'app-file-rekognition-view',
  templateUrl: './file-rekognition-view.component.html',
  styleUrls: ['./file-rekognition-view.component.scss'],
})
export class FileRekognitionViewComponent implements OnInit {
  
  public videoItems: Array<any> = [
    {
      name: 'video',
      src: ' ',
      type: 'video/mp4'
    }
  ]

  activeIndex = 0
  currentVideo = this.videoItems[this.activeIndex]
  data: any

  private baseUrl = 'http://localhost:8000'
  private jobId!: string
  private videoData?: JSON
  private labels?: JSON
  private labelTotal?: JSON
  private videoFileName?: string
  strLabels?: string // Dev purposes
  strVideoData?: string // Dev purposes
  private currentBorderBox: HTMLElement | null = null


  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '1'
    this.requestFileForID().subscribe(fileidname => {
      this.videoFileName = fileidname.result.file_id
      this.videoItems[0].src = this.CDN_WrapFileUrl(this.videoFileName)
      this.videoItems[0].name = this.videoFileName



    })
    this.requestLabels().subscribe(awsResult => {
      this.videoData = awsResult.VideoMetadata
      this.labels = this.tablePrepper(awsResult.Labels)
      this.labelTotal = this.sumTotalLabelOccurrences(this.labels)
    })
    
    
    // Dev purposes
    this.strLabels = JSON.stringify(this.labels)
    this.strVideoData = JSON.stringify(this.videoData)
  }
  onPlayerReady(api: VgApiService) {
    this.data = api;
    this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
    this.data.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
    
  }
  nextVideo() {
    this.activeIndex++;
    if (this.activeIndex === this.videoItems.length) {
      this.activeIndex = 0;
    }
    this.currentVideo = this.videoItems[this.activeIndex];
  }
  initVdo() {
    this.data.play();
    this.data.seekTime(99999999, false)
  }
  startPlaylistVdo(item: any, index: number) {
    this.activeIndex = index;
    this.currentVideo = item;
  }
  

  public getAssociatedFile(): string {
    return this.videoFileName!
  }

  public requestLabels(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/job/${this.jobId}`)
  }

  public requestFileForID(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/file_for_job/${this.jobId}`)
  }

  public CDN_WrapFileUrl(filename:any): string {
    
    return `https://dthqh9b9a8scb.cloudfront.net/${filename}`
  }

  public getJobId(): string {
    return this.jobId || 'Route Not Valid'
  }

  public getLabels(): any {
    return this.labels
  }

  //public getLabelBy

  public seekTimestampInVideo(timestamp:number, boxinfo:any): void{
    this.data.seekTime(timestamp)
    var containerForBox: HTMLElement | null = document.getElementById('containerforbox')
    this.currentBorderBox?.remove()
    const newBox : HTMLElement = document.createElement("span")

    newBox.setAttribute("style", `border-style:double;border-color:red;position:absolute;top:${boxinfo.Top * 100}%;left:${boxinfo.Left * 100}%;width:${containerForBox!.getBoundingClientRect().width * boxinfo.Width}px;height:${containerForBox!.getBoundingClientRect().height * boxinfo.Height}px;z-index:2;`)

    containerForBox!.appendChild(newBox)
    this.currentBorderBox = newBox
  }

  public getLabelTotal(){
    return this.labelTotal
  }

  public sumTotalLabelOccurrences(obj:any){
    return obj.reduce((accumulator:any, object:any) => accumulator + object.length, 0)
  }

  public tablePrepper(obj:any){
    var result = obj.map(
      ({Timestamp, Label:{Aliases, Categories, Confidence, Name, Parents, Instances }}:any) => 
      ({Name, Aliases, Parents, Categories, Confidence, Timestamp, Instances})
    )

    result = this.resolveArraysForTable(result)
    return result
  }

  private resolveArraysForTable(obj:any){
    // For each label we need to convert possible arrays into comma-separated strings
    for(var i = 0; i < obj.length; i++) {
      var label = obj[i]
      var tmp = ""
      
      // Resolve Aliases
      for(var j = 0; j<label.Aliases.length; j++){
        tmp += label.Aliases[j].Name + ", "
      }
      label.Aliases = tmp.replace(/,\s*$/, "") //Regex for trailing comma and whitespace

      // Resolve Parents
      for(var j = 0; j<label.Parents.length; j++){
        tmp += label.Parents[j].Name + ", "
      }
      label.Parents = tmp.replace(/,\s*$/, "") //Regex for trailing comma and whitespace

      // Resolve Categories
      tmp = ""
      for(var j = 0; j<label.Categories.length; j++){
        tmp += label.Categories[j].Name + ", "
      }
      label.Categories = tmp.replace(/,\s*$/, "") //Regex for trailing comma and whitespace
    }

    return obj
  }
}