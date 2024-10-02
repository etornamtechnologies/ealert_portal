import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeBroadcastEmailComponent } from './authorize-broadcast-email.component';

describe('AuthorizeBroadcastEmailComponent', () => {
  let component: AuthorizeBroadcastEmailComponent;
  let fixture: ComponentFixture<AuthorizeBroadcastEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeBroadcastEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeBroadcastEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
