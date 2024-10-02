import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EStatementsComponent } from './e-statements.component';

describe('EStatementsComponent', () => {
  let component: EStatementsComponent;
  let fixture: ComponentFixture<EStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EStatementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
