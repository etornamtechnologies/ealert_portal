import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUserDetailsComponent } from './confirm-user-details.component';

describe('ConfirmUserDetailsComponent', () => {
  let component: ConfirmUserDetailsComponent;
  let fixture: ComponentFixture<ConfirmUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmUserDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
