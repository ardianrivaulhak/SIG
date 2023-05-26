import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterModalComponent } from './parameter-modal.component';

describe('ParameterModalComponent', () => {
  let component: ParameterModalComponent;
  let fixture: ComponentFixture<ParameterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
