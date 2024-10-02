import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExemptionComponent } from './customer-exemption.component';

describe('CustomerExemptionComponent', () => {
  let component: CustomerExemptionComponent;
  let fixture: ComponentFixture<CustomerExemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerExemptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
