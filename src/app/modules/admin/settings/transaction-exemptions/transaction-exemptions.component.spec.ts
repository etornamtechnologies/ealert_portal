import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionExemptionsComponent } from './transaction-exemptions.component';

describe('TransactionExemptionsComponent', () => {
  let component: TransactionExemptionsComponent;
  let fixture: ComponentFixture<TransactionExemptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionExemptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionExemptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
