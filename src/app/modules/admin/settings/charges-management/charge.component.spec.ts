import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeManagementComponent } from './charge.component';

describe('ChangePasswordComponent', () => {
  let component: ChargeManagementComponent;
  let fixture: ComponentFixture<ChargeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
