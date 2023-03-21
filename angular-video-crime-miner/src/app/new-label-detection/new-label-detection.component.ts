import { HttpClient } from '@angular/common/http'
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-new-label-detection',
  templateUrl: './new-label-detection.component.html',
  styleUrls: ['./new-label-detection.component.scss']
})
export class NewLabelDetectionComponent implements OnInit {

  @ViewChild('labelField') labelField: any;

  @Output() popUpToDetCasePageEmitter = new EventEmitter<any> // used to transmit to parent component

  // transmit job has started to parent component
  public emitJobSentToDetCaseView(eventMsg:any): void {
    this.popUpToDetCasePageEmitter.emit(eventMsg)
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { 
    this.http.get('assets/AmazonRekognitionAllLabels_v3.0.csv', {responseType: 'text'})
    .subscribe(
        data => {
            let csvToRowArray = data.split("\r\n");
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              let row = csvToRowArray[index].split(",");
              this.labelArray.push( { "label": row[0] } );
            }
            console.log(this.labelArray);
        },
        error => {
            console.log(error);
        }
    );
   }

   public labelArray: Array<any> = []

  

  public keyword:string = 'label'

  selectEvent(item:any) {
    // do something with selected item
    this.addNewLabel(item.label)
    this.labelField.clear()
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e:any){
    // do something when input is focused
  }

  private baseUrl = 'http://localhost:8000'
  private files!: any
  private caseId!: number
  private labels: string[] = []
  public textValue: string = ""
  public selectedFile! : string
  public newLabelForm: FormGroup = new FormGroup({
    label: new FormControl("")
  })

  ngOnInit(): void {
    this.caseId = parseInt(this.route.snapshot.paramMap.get("caseId") || "0")
    this.requestCaseFiles().subscribe((res) => {
      this.files = res.data
    })
  }

  public getFiles(): any {
    return this.files
  }

  public getCaseId(): number {
    return this.caseId
  }

  public setCaseId(newCaseId:number): void {
    this.caseId = newCaseId
  }

  public getLabels(): string[] {
    return this.labels
  }

  public setLabels(newLabels:string[]): void {
    this.labels = newLabels
  }

  public setSelectedFile(newSelectedFile:string): void {
    this.selectedFile = newSelectedFile
  }

  public addNewLabel(newLabel:string): void {
    
    this.labels.push(newLabel)

    this.updateLabelList()
  }

  public updateLabelList(){
    var elem:HTMLElement = document.getElementById("labelsList")!
    elem.innerHTML = this.labels.toString()
  }

  public sendJobCreationRequest(): void {
    
    var body:Object = {"labels": this.labels}
    this.http.post(`${this.baseUrl}/labels/file/${this.selectedFile}`, body).subscribe((res:any) => {
      
      if(res.data.JobId != undefined){
        
        this.emitJobSentToDetCaseView(this.getCaseId().toString())
        
      }
    })
  }

  public requestCaseFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/case/${this.caseId}`)
  }

}
