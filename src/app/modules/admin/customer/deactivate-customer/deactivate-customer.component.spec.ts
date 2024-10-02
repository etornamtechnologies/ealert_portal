import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateCustomerComponent } from './deactivate-customer.component';

describe('DeactivateCustomerComponent', () => {
  let component: DeactivateCustomerComponent;
  let fixture: ComponentFixture<DeactivateCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeactivateCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
