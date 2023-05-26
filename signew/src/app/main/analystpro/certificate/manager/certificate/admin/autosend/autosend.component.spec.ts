import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosendComponent } from './autosend.component';

describe('AutosendComponent', () => {
  let component: AutosendComponent;
  let fixture: ComponentFixture<AutosendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutosendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
