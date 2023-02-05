import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-detailed-case-view',
  templateUrl: './detailed-case-view.component.html',
  styleUrls: ['./detailed-case-view.component.scss']
})
export class DetailedCaseViewComponent implements OnInit {

fromDialog!:string;

@ViewChild('dialogRef')
dialogRef!: TemplateRef<any>

myFooList = ['Labels']

  OpenPopup(){
    const myCompDialog = this.dialog.open(this.dialogRef,{data:this.myFooList})

  }

  private baseUrl = 'http://localhost:8000'
  private caseId!: string
  private caseInfo?: JSON
  private caseFiles?: JSON
  private caseOutputs?: JSON

  constructor(private http: HttpClient, private route: ActivatedRoute, public dialog:MatDialog) { }



  ngOnInit(): void {
    this.fromDialog = "I like turtles..."
    this.caseId = this.route.snapshot.paramMap.get('caseId') || '1'
    this.requestCaseInfo().subscribe(res => {
      this.caseInfo = res
    })

    this.requestCaseFiles().subscribe(res => {
      this.caseFiles = res
      this.requestCaseOutputs(this.caseFiles).subscribe(res =>{ // Must be nested because requestCaseOutputs relies on this.caseFiles
        this.caseOutputs = res
      })
    })
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
}






