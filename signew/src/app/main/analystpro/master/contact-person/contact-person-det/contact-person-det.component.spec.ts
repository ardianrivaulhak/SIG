import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPersonDetComponent } from './contact-person-det.component';

describe('ContactPersonDetComponent', () => {
  let component: ContactPersonDetComponent;
  let fixture: ComponentFixture<ContactPersonDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPersonDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersonDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
