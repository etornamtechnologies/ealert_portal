import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountClassExemptionComponent } from './account-class-exemption.component';

describe('AccountClassExemptionComponent', () => {
  let component: AccountClassExemptionComponent;
  let fixture: ComponentFixture<AccountClassExemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountClassExemptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountClassExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
