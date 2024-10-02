import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCustomerExemptionComponent } from './verify-customer.component';

describe('VerifyCustomerComponent', () => {
  let component: VerifyCustomerExemptionComponent;
  let fixture: ComponentFixture<VerifyCustomerExemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyCustomerExemptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyCustomerExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
