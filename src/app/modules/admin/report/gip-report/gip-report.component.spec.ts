import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GipReportComponent } from './gip-report.component';

describe('GipReportComponent', () => {
  let component: GipReportComponent;
  let fixture: ComponentFixture<GipReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GipReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GipReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
