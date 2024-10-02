import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeConfigurationComponent } from './charge-configuration.component';

describe('ChargeConfigurationComponent', () => {
  let component: ChargeConfigurationComponent;
  let fixture: ComponentFixture<ChargeConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
