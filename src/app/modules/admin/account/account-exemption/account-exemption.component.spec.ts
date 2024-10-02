import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountExemptionComponent } from './account-exemption.component';

describe('AccountExemptionComponent', () => {
  let component: AccountExemptionComponent;
  let fixture: ComponentFixture<AccountExemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountExemptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
