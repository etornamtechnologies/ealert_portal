import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerReport } from './customer-report.component';


describe('ManageCustomerComponent', () => {
  let component: CustomerReport;
  let fixture: ComponentFixture<CustomerReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerReport ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
