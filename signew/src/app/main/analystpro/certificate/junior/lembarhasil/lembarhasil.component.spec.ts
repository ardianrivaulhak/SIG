import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LembarhasilComponent } from './lembarhasil.component';

describe('LembarhasilComponent', () => {
  let component: LembarhasilComponent;
  let fixture: ComponentFixture<LembarhasilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LembarhasilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LembarhasilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
