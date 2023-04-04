import { HttpClient } from '@angular/common/http'
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms'
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

  public form!: FormGroup

  // constructor fetches dataset containing all valid labels for Rekognition and constructs checkbox form for selected files from job
  // eventually dataset should be something fetched from backend, instead of retrieved locally by Angular Client
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { 
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

    this.form = fb.group({
      selectedFiles: new FormArray([])
    })

   }

   // event triggered by changing any values on checkbox form
  onCheckboxChange(event: any) {
    
    const selectedFiles = (this.form.controls['selectedFiles'] as FormArray);
    if (event.target.checked) {
      selectedFiles.push(new FormControl(event.target.value));
      //this.selectedFiles.push(event.target.value)
    } else {
      const index = selectedFiles.controls
      .findIndex(x => x.value === event.target.value);
      selectedFiles.removeAt(index);
    }
  }

  // submit method for checkbox form
  // NOT USED, but project won't build without valid reference
  submitFileSelection() {
    console.log(this.form.value);
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

  // tracks files used to create new video analysis job
  public selectedFiles: string[] = []

  ngOnInit(): void {
    this.caseId = parseInt(this.route.snapshot.paramMap.get("caseId") || "0")
    this.requestCaseFiles().subscribe((res) => {
      this.files = res.data
    })
  }

  public getFiles(): any {
    //console.log(this.files)
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

  public addSelectedFile(newSelectedFile:string): void {
    this.selectedFiles.push(newSelectedFile)
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
    
    const selectedFiles = (this.form.controls['selectedFiles'] as FormArray).value

    

    var body:Object = {"labels": this.labels, "filenames": selectedFiles}

    console.log("Keywords: ", body)

    // starts video analysis job for all files included in "filenames" attribute in body
    this.http.post(`${this.baseUrl}/labels/files`, body).subscribe( (res:any) => {
      if(res.data.jobIdsForFiles.length != 0){
        console.log("Job Ids For Files: ", res)

        // if job was successfully started, opens pop-up to view label detection jobs, which will show all existing jobs, including the newly created one
        this.emitJobSentToDetCaseView(this.getCaseId().toString())
        
      }
    } )

  }

  public requestCaseFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/case/${this.caseId}`)
  }

}
