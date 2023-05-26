import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalParameterRevisionComponent } from './modal-parameter-revision.component';

describe('ModalParameterRevisionComponent', () => {
  let component: ModalParameterRevisionComponent;
  let fixture: ComponentFixture<ModalParameterRevisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalParameterRevisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalParameterRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
