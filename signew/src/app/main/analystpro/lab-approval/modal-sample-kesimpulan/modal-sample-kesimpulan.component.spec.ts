import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSampleKesimpulanComponent } from './modal-sample-kesimpulan.component';

describe('ModalSampleKesimpulanComponent', () => {
  let component: ModalSampleKesimpulanComponent;
  let fixture: ComponentFixture<ModalSampleKesimpulanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSampleKesimpulanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSampleKesimpulanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
