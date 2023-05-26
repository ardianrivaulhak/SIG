import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcatalogueDetComponent } from './subcatalogue-det.component';

describe('SubcatalogueDetComponent', () => {
  let component: SubcatalogueDetComponent;
  let fixture: ComponentFixture<SubcatalogueDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcatalogueDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcatalogueDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
