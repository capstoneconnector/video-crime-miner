import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './App/app.component';
import { UploadComponent } from './Upload/Upload.component';
import { LoginComponent } from './Login/Login.component';


@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
