import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavComponent ],
      providers: [
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resize without errors', () => {
    const res = component.onResize(Event)
    expect(res).toBeUndefined()
  })

  it('should collapse without errors', () => {
    const res = component.toggleCollapse()
    expect(res).toBeUndefined()
  })

  it('should close without errors', () => {
    const res = component.closeSidenav()
    expect(res).toBeUndefined()
  })
});
