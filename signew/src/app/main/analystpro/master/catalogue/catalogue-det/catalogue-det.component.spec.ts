import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueDetComponent } from './catalogue-det.component';

describe('CatalogueDetComponent', () => {
  let component: CatalogueDetComponent;
  let fixture: ComponentFixture<CatalogueDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
