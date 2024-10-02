import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfStatementsComponent } from './pf-statements.component';

describe('PfStatementsComponent', () => {
  let component: PfStatementsComponent;
  let fixture: ComponentFixture<PfStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfStatementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
