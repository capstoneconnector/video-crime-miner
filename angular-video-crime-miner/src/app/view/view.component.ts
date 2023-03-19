import { Component, OnInit } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http'
import { Router } from '@angular/router'
import { CognitoService, IUser } from '../cognito.service'

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
    this.resetInputs()
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
  public user: any
  public username: string

  public getUser(): string {
    return JSON.stringify(this.user.sub)
  }

  /* Constructor */
  constructor(private http: HttpClient, private router: Router, private cognitoService: CognitoService) {
    this.user = {}
    this.username = ""
  }

  ngOnInit(): void {
    this.cognitoService.getUser().then((user: any) => {
      this.user = user.attributes
      this.username = this.user.sub
    }).then(() => {
      this.requestCases().subscribe(res => {
        this.caseInfos = res.data
      })
    })
  }

  /* Get cases request and response handler */
  public requestCases(): Observable<any> {
    const body = {
      params: {
        username: this.username
      }
    }
    return this.http.get(`${this.baseUrl}/cases`, body)
  }
  public getCaseInfos(): any{
    return this.caseInfos
  }

  /* Create new case request and response handler */
  newCaseName: string = ""
  newCaseDescription: string = ""
  public addNewCase(newCaseName: string, newCaseDescription: string): void {
    //TODO: Data sanitization: we need to make sure only alphanumeric characters are there
    if(newCaseName.length<3 || newCaseDescription.length<1){
      // TODO: add a new message that says the fields aren't filled out
      let message = "ERROR: Case name must be length 3 or more, and there must be a description"
      this.setFeedbackMessage(false, message)
      return
    }
    var body = {
      name: newCaseName,
      description: newCaseDescription,
      labels: [],
      username: this.username
    }
    this.http.post(`${this.baseUrl}/cases`, body).subscribe((res:any) => {
      if(res.success){
        this.resetInputs()
        this.setFeedbackMessage(true)
		this.closepopup()
		this.ngOnInit()

      }else{
        this.setFeedbackMessage(false, "ERROR: The case could not be created")
      }
    })
  }

  /* Input clearing */
  private resetInputs(): void{
    this.newCaseDescription = ""
    this.newCaseName = ""
  }

  /* User Message Feedback */
  public successMessage:string = ""
  public errorMessage:string = ""
  private setFeedbackMessage(success:boolean, message:string = ""): void{
    if(success){
      this.errorMessage = ""
      this.successMessage = "Case Created"
    }else{
      this.successMessage = ""
      this.errorMessage = message
    }
  }

  /* Clickable cases */
  selectedCase?: any
  public onSelectCase(theCase: any): void{
    this.selectedCase = theCase
  }

  public onDoubleClickCase(theCase: any): void{
    this.router.navigateByUrl('/detailed-case-view/' + theCase.id)
  }

  /* Animations and Style Functions */
}