import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastContactComponent } from './broadcast-contact.component';

describe('BroadcastContactComponent', () => {
  let component: BroadcastContactComponent;
  let fixture: ComponentFixture<BroadcastContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
