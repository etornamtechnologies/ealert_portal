import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeBroadcastSmsComponent } from './authorize-broadcast-sms.component';

describe('AuthorizeBroadcastSmsComponent', () => {
  let component: AuthorizeBroadcastSmsComponent;
  let fixture: ComponentFixture<AuthorizeBroadcastSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeBroadcastSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeBroadcastSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
