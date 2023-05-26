import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouModalsComponent } from './mou-modals.component';

describe('MouModalsComponent', () => {
  let component: MouModalsComponent;
  let fixture: ComponentFixture<MouModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
