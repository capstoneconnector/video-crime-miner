import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  /* Popup */
  showPopup = false
  openpopup(){
    this.showPopup = true
  }
  closepopup(){
    this.showPopup = false
  }
  closeoverlay(e:any){
    if(e.target.classList.contains('overlay')){
      this.showPopup = false
    }
  }

  /* Class member variables */
  private baseUrl = 'http://localhost:8000'
  caseInfos?: Observable<any>

  /* Constructor */
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.requestCases().subscribe(res => {
      this.caseInfos = res.data
    })
  }

  /* Get cases request and response handler */
  public requestCases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cases`)
  }
  public getCaseInfos(): any{
    return this.caseInfos
  }

  /* Create new case request and response handler */

  newCaseName: string = ""
  newCaseDescription: string = ""
  public addNewCase(newCaseName: string, newCaseDescription: string): void {
    //TODO: Data sanitization; we need to make sure only alphanumeric characters are there
    //var newCaseName = document.getElementById("new-case-name")?.value
    //var newCaseDescription = document.getElementById("new-case-description")?.innerText
    document.getElementById("newCaseDescription")!.innerHTML = "Inside of addnewcase"
    if(newCaseName!.length<3 || newCaseDescription!.length<1){
      // TODO: add a new message that says the fields aren't filled out
      return
    }
    var body = {
      name: newCaseName,
      description: newCaseDescription,
      labels: []
    }
    this.http.post(`${this.baseUrl}/cases`, body).subscribe((res:any) => {
      if(res.success){
        // TODO: add a new message that says it was a success
      }else{
        // TODO: add a new message that says it failed
      }
    })
  }

}
