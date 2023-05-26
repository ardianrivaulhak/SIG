import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LodDetComponent } from './lod-det.component';

describe('LodDetComponent', () => {
  let component: LodDetComponent;
  let fixture: ComponentFixture<LodDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LodDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LodDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
