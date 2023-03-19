import { animate, keyframes, style, transition, trigger } from '@angular/animations'
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { CognitoService } from '../cognito.service'
import { navbarData } from './nav-data'

interface SideNavToggle {
  screenWidth: number
  collapsed: boolean
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('350ms',
          style({opacity: 0})
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  constructor(private router: Router, private cognitoService: CognitoService) {
    cognitoService.getAuthenticationSubject().subscribe((value) => {
      this.isAuthenticated = value
    })
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth
  }

  /* Regular Nav Bar Stuff */
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter()
  collapsed = false
  screenWidth = 0
  navData = navbarData

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth
    if(this.screenWidth <= 768 ) {
      this.collapsed = false
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
    }
  }

  private timerId: any = null
  toggleCollapse(): void {
    if (this.timerId) {
      clearTimeout(this.timerId) // cancel the previous timer
    }
  
    if (this.collapsed) { // delay of 1 second
      this.timerId = setTimeout(() => {
        this.collapsed = false
        this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
      }, 1000)
    } else {
      this.collapsed = true
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
    }
  }

  closeSidenav(): void {
    this.collapsed = false
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth})
  }

  /* Cognito Authentication */
  public isAuthenticated: boolean = false

  /* Sign Out Button */
  public signOut(): void {
    this.cognitoService.signOut()
    .then(() => {
    this.router.navigate(['/signIn'])
    })
  }
}