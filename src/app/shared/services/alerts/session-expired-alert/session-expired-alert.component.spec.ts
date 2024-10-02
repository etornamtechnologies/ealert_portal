import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiredAlertComponent } from './session-expired-alert.component';

describe('SessionExpiredAlertComponent', () => {
  let component: SessionExpiredAlertComponent;
  let fixture: ComponentFixture<SessionExpiredAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpiredAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiredAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
