import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCustomerRegistrationComponent } from './bulk-customer-registration.component';

describe('BulkCustomerRegistrationComponent', () => {
  let component: BulkCustomerRegistrationComponent;
  let fixture: ComponentFixture<BulkCustomerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkCustomerRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCustomerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
