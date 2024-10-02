import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCollectionUserComponent } from './view-collection-user.component';

describe('ViewCollectionUserComponent', () => {
  let component: ViewCollectionUserComponent;
  let fixture: ComponentFixture<ViewCollectionUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCollectionUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCollectionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
