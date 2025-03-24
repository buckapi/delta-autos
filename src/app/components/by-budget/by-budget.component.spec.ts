import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByBudgetComponent } from './by-budget.component';

describe('ByBudgetComponent', () => {
  let component: ByBudgetComponent;
  let fixture: ComponentFixture<ByBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
