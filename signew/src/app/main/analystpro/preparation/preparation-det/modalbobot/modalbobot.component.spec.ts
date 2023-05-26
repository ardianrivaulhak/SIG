import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalbobotComponent } from './modalbobot.component';

describe('ModalbobotComponent', () => {
  let component: ModalbobotComponent;
  let fixture: ComponentFixture<ModalbobotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalbobotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalbobotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
