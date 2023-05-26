import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContracteditComponent } from './contractedit.component';

describe('ContracteditComponent', () => {
  let component: ContracteditComponent;
  let fixture: ComponentFixture<ContracteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContracteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContracteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
