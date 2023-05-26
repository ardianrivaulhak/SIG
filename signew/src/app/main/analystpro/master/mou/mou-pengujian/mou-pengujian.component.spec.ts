import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouPengujianComponent } from './mou-pengujian.component';

describe('MouPengujianComponent', () => {
  let component: MouPengujianComponent;
  let fixture: ComponentFixture<MouPengujianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouPengujianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouPengujianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
