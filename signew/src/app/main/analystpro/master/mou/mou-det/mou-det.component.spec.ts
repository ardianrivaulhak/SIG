import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouDetComponent } from './mou-det.component';

describe('MouDetComponent', () => {
  let component: MouDetComponent;
  let fixture: ComponentFixture<MouDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
