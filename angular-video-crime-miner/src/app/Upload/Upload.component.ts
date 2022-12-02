import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) { }
  
  SERVER_URL = "http://localhost:8000/users/1/upload";
  uploadForm!: FormGroup;

  ngOnInit(){
    this.uploadForm = this.formBuilder.group({
      userFile: ['']
    });
  }

  onFileSelect(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('userFile')!.setValue(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('userFile')!.value);
    console.log("submitting ")
    return this.httpClient.post<any>(this.SERVER_URL, formData).subscribe((res) => console.log(res))
  }

}

/*
<script>
  //This script helps the upload send the correct parameters to the backend server
  const form = document.getElementById("uploadForm");
  console.log(form)

  form.addEventListener("submit", submitForm);
  function submitForm(e) {
    e.preventDefault();
    console.log("LOOK AT  ME")
    try{
      const files = document.getElementById("userFiles");
      const formData = new FormData();
      for(let i =0; i < files.files.length; i++) {
              formData.append("files", files.files[i]);
      }
      fetch("http://localhost:8000/users/1/upload", {
          method: 'POST',
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
      })
          .then((res) => console.log(res))
          .catch((err) => ("Error occured: ", err));
    }catch (e){
      console.log(e)
    }
  }
  
</script>
*/