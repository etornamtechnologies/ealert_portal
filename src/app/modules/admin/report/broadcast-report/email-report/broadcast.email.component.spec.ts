import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadContactComponent } from './broadcast.email.component';

describe('UploadContactComponent', () => {
  let component: UploadContactComponent;
  let fixture: ComponentFixture<UploadContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
