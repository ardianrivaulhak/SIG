import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessopenComponent } from './processopen.component';

describe('ProcessopenComponent', () => {
  let component: ProcessopenComponent;
  let fixture: ComponentFixture<ProcessopenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessopenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
