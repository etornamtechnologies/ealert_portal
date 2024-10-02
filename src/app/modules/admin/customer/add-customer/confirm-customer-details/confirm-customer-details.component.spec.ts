import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCustomerDetailsComponent } from './confirm-customer-details.component';

describe('ConfirmCustomerDetailsComponent', () => {
  let component: ConfirmCustomerDetailsComponent;
  let fixture: ComponentFixture<ConfirmCustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCustomerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
