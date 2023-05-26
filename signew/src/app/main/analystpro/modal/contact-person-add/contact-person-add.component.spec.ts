import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPersonAddComponent } from './contact-person-add.component';

describe('ContactPersonAddComponent', () => {
  let component: ContactPersonAddComponent;
  let fixture: ComponentFixture<ContactPersonAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactPersonAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersonAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
