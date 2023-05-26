import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarParameterComponent } from './sidebar-parameter.component';

describe('SidebarParameterComponent', () => {
  let component: SidebarParameterComponent;
  let fixture: ComponentFixture<SidebarParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
