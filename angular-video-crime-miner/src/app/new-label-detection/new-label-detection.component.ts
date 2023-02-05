import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-label-detection',
  templateUrl: './new-label-detection.component.html',
  styleUrls: ['./new-label-detection.component.scss']
})
export class NewLabelDetectionComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
