import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeCustomerComponent } from './authorize-customer.component';

describe('AuthorizeCustomerComponent', () => {
  let component: AuthorizeCustomerComponent;
  let fixture: ComponentFixture<AuthorizeCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
