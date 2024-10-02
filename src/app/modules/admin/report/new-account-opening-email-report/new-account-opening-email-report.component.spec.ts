import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountOpeningEmailReportComponent } from './new-account-opening-email-report.component';

describe('SmsReportComponent', () => {
  let component: NewAccountOpeningEmailReportComponent;
  let fixture: ComponentFixture<NewAccountOpeningEmailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAccountOpeningEmailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAccountOpeningEmailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
