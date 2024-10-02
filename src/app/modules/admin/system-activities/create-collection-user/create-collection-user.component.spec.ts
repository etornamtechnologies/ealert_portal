import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionUserComponent } from './create-collection-user.component';

describe('CreateCollectionUserComponent', () => {
  let component: CreateCollectionUserComponent;
  let fixture: ComponentFixture<CreateCollectionUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCollectionUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
