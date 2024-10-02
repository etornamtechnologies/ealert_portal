import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastSmsComponent } from './broadcast-sms.component';

describe('BroadcastSmsComponent', () => {
  let component: BroadcastSmsComponent;
  let fixture: ComponentFixture<BroadcastSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
