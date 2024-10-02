import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountDialogComponent } from './customer-account-dialog.component';

describe('CustomerAccountDialogComponent', () => {
  let component: CustomerAccountDialogComponent;
  let fixture: ComponentFixture<CustomerAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAccountDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
