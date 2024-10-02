import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCollectionUserDetailsComponent } from './confirm-collection-user-details.component';

describe('ConfirmCollectionUserDetailsComponent', () => {
  let component: ConfirmCollectionUserDetailsComponent;
  let fixture: ComponentFixture<ConfirmCollectionUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCollectionUserDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCollectionUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
