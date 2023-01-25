import { Component, OnInit } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { TranscribeService } from 'aws-sdk'
import { json } from 'stream/consumers'

@Component({
  selector: 'app-file-rekognition-view',
  templateUrl: './file-rekognition-view.component.html',
  styleUrls: ['./file-rekognition-view.component.scss'],
})
export class FileRekognitionViewComponent implements OnInit {

  private baseUrl = 'http://localhost:8000'
  private jobId!: string
  private videoData?: JSON
  private labels?: JSON
  private labelTotal?: JSON
  strLabels?: string // Dev purposes
  strVideoData?: string // Dev purposes

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '1'
    this.requestLabels().subscribe(awsResult => {
      this.videoData = awsResult.VideoMetadata
      this.labels = this.tablePrepper(awsResult.Labels)
      this.labelTotal = this.sumTotalLabelOccurrences(this.labels)
    })
    // Dev purposes
    this.strLabels = JSON.stringify(this.labels)
    this.strVideoData = JSON.stringify(this.videoData)
  }

  public requestLabels(): Observable<any> {
    return this.http.get(`${this.baseUrl}/labels/job/${this.jobId}`)
  }

  public getJobId(): string {
    return this.jobId || 'Route Not Valid'
  }

  public getLabels(): any {
    return this.labels
  }

  public getLabelTotal(){
    return this.labelTotal
  }

  public sumTotalLabelOccurrences(obj:any){
    return obj.reduce((accumulator:any, object:any) => accumulator + object.length, 0)
  }

  public tablePrepper(obj:any){
    var result = obj.map(
      ({Timestamp, Label:{Aliases, Categories, Confidence, Name, Parents, Instances:{length}}}:any) => 
      ({Name, Aliases, Parents, Categories, Confidence, Timestamp, length})
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