import { Component, OnInit } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { TranscribeService } from 'aws-sdk'

@Component({
  selector: 'app-file-rekognition-view',
  templateUrl: './file-rekognition-view.component.html',
  styleUrls: ['./file-rekognition-view.component.scss']
})
export class FileRekognitionViewComponent implements OnInit {

  private baseUrl = 'http://localhost:8000'
  private jobId!: string
  private videoData?: JSON
  private labels?: JSON
  strLabels?: string // Dev purposes
  strVideoData?: string // Dev purposes

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '1'
    this.requestLabels().subscribe(awsResult => {
      this.videoData = awsResult.VideoMetadata
      //this.labels = this.flatten(awsResult.Labels)
      this.labels = this.mapper(awsResult.Labels)
      //this.labels = awsResult.Labels

      // Dev purposes
      this.strLabels = JSON.stringify(this.labels)
      this.strVideoData = JSON.stringify(this.videoData)
    })
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

  public flatten(obj: any) {
    return Object.keys(obj).reduce((acc:any, current) => {
      const _key = `${current}`
      const currentValue = obj[current]
      if (Array.isArray(currentValue) || Object(currentValue) === currentValue) {
        Object.assign(acc, this.flatten(currentValue))
      } else {
        acc[_key] = currentValue
      }
      return acc
    }, {})
  }

  public mapper(obj:any){
    var result = obj.map(
      ({Timestamp, Label:{Aliases, Categories, Confidence, Name, Parents}}:any) => 
      ({Name, Aliases, Parents, Categories, Confidence, Timestamp})
    )
    result.Aliases = JSON.stringify(result.Aliases)
    return result

  }
  /*
    public flatten(obj: any) {
    var newObj = JSON
    for(var key in obj){
      Object.keys(key).reduce((acc:any, current) => {
        const _key = `${current}`
        const currentValue = obj[current]
        if (Array.isArray(currentValue) || Object(currentValue) === currentValue) {
          Object.assign(acc, this.flatten(currentValue))
        } else {
          acc[_key] = currentValue
        }
        newObj+=acc
      }, {})
    }
    //labelsList = Object.assign({}, labelsList)
    return newObj
  }
  */

}
