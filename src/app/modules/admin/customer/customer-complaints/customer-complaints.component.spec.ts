import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintsComponent } from './customer-complaints.component';

describe('CustomerComplaintsComponent', () => {
  let component: CustomerComplaintsComponent;
  let fixture: ComponentFixture<CustomerComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
