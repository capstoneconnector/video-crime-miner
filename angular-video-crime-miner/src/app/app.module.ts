import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewComponent } from './view/view.component';
import { MediaComponent } from './media/media.component';

import { ReportsComponent } from './reports/reports.component';

import { IonicModule } from '@ionic/angular';

import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FileListComponent } from './file-list/file-list.component';
import { FileRekognitionViewComponent } from './file-rekognition-view/file-rekognition-view.component';
import { DetailedCaseViewComponent } from './detailed-case-view/detailed-case-view.component';
import { NewLabelDetectionComponent } from './new-label-detection/new-label-detection.component';

import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SidenavComponent,
    BodyComponent,
    DashboardComponent,
    ViewComponent,
    MediaComponent,
    ReportsComponent,
    FileListComponent,
    FileRekognitionViewComponent,
    DetailedCaseViewComponent,
    NewLabelDetectionComponent,
    SignUpComponent,
    SignInComponent,
    ProfileComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
