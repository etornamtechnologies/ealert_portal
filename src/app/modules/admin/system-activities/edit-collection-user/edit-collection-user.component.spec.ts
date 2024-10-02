import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCollectionUserComponent } from './edit-collection-user.component';

describe('EditCollectionUserComponent', () => {
  let component: EditCollectionUserComponent;
  let fixture: ComponentFixture<EditCollectionUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCollectionUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCollectionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
