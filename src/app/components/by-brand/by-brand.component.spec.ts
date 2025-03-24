import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByBrandComponent } from './by-brand.component';

describe('ByBrandComponent', () => {
  let component: ByBrandComponent;
  let fixture: ComponentFixture<ByBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
