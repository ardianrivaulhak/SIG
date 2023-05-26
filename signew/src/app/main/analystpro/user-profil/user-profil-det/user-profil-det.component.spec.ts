import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilDetComponent } from './user-profil-det.component';

describe('UserProfilDetComponent', () => {
  let component: UserProfilDetComponent;
  let fixture: ComponentFixture<UserProfilDetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfilDetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
