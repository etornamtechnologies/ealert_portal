import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpReportComponent } from './otp-report.component';

describe('OtpReportComponent', () => {
  let component: OtpReportComponent;
  let fixture: ComponentFixture<OtpReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
