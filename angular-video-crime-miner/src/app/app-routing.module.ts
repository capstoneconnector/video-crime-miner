import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MediaComponent } from './media/media.component';
import { ReportsComponent } from './reports/reports.component';
import { UploadComponent } from './upload/Upload.component';
import { FileRekognitionViewComponent } from './file-rekognition-view/file-rekognition-view.component';
import { DetailedCaseViewComponent } from './detailed-case-view/detailed-case-view.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'view', component: ViewComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'media', component: MediaComponent},
  {path: 'file-rekognition-view/:jobId', component: FileRekognitionViewComponent},
  {path: 'detailed-case-view/:caseId', component: DetailedCaseViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
