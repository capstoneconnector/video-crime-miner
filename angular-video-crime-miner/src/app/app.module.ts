import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/Upload.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewComponent } from './view/view.component';
import { MediaComponent } from './media/media.component';
import { SettingsComponent } from './settings/settings.component';
import { ReportsComponent } from './reports/reports.component';
import { StatsComponent } from './stats/stats.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SidenavComponent,
    BodyComponent,
    DashboardComponent,
    ViewComponent,
    MediaComponent,
    SettingsComponent,
    ReportsComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
