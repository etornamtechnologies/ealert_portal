import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessChargeComponent } from './process-charge.component';

describe('ProcessChargeComponent', () => {
  let component: ProcessChargeComponent;
  let fixture: ComponentFixture<ProcessChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessChargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
