import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemocomplainqcComponent } from './memocomplainqc.component';

describe('MemocomplainqcComponent', () => {
  let component: MemocomplainqcComponent;
  let fixture: ComponentFixture<MemocomplainqcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemocomplainqcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemocomplainqcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
