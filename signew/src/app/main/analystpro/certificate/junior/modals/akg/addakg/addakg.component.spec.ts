import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddakgComponent } from './addakg.component';

describe('AddakgComponent', () => {
  let component: AddakgComponent;
  let fixture: ComponentFixture<AddakgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddakgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddakgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
