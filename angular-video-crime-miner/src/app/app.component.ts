import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoService } from './cognito.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'angular-video-crime-miner';
  
  isAuthenticated: boolean;
  constructor(private router: Router,
    private cognitoService: CognitoService) {
this.isAuthenticated = false;
}

public ngOnInit(): void {
this.cognitoService.isAuthenticated()
.then((success: boolean) => {
this.isAuthenticated = success;
});
}

public signOut(): void {
this.cognitoService.signOut()
.then(() => {
this.router.navigate(['/signIn']);
});
}

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
