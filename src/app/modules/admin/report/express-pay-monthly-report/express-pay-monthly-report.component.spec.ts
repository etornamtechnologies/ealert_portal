import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressPayMonthlyReportComponent } from './express-pay-monthly-report.component';

describe('ExpressPayMonthlyReportComponent', () => {
  let component: ExpressPayMonthlyReportComponent;
  let fixture: ComponentFixture<ExpressPayMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressPayMonthlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressPayMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
