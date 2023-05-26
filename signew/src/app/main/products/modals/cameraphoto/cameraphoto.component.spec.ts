import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraphotoComponent } from './cameraphoto.component';

describe('CameraphotoComponent', () => {
  let component: CameraphotoComponent;
  let fixture: ComponentFixture<CameraphotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraphotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraphotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
