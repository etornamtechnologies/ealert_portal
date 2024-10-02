import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockCustomerComponent } from './unlock-customer.component';

describe('UnlockCustomerComponent', () => {
  let component: UnlockCustomerComponent;
  let fixture: ComponentFixture<UnlockCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnlockCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
