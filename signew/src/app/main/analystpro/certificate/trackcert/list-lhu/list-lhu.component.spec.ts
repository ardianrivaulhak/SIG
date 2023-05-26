import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLhuComponent } from './list-lhu.component';

describe('ListLhuComponent', () => {
  let component: ListLhuComponent;
  let fixture: ComponentFixture<ListLhuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLhuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLhuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
