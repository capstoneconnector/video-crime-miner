import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './Login/Login.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './App/app.component';
import { UploadComponent } from './Upload/Upload.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
