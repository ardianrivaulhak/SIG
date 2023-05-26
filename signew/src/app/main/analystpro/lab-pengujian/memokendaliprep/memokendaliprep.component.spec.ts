import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemokendaliprepComponent } from './memokendaliprep.component';

describe('MemokendaliprepComponent', () => {
  let component: MemokendaliprepComponent;
  let fixture: ComponentFixture<MemokendaliprepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemokendaliprepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemokendaliprepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
