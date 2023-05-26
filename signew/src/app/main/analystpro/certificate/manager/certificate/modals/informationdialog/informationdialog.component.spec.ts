import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationdialogComponent } from './informationdialog.component';

describe('InformationdialogComponent', () => {
  let component: InformationdialogComponent;
  let fixture: ComponentFixture<InformationdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
