import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutopartsComponent } from './autoparts.component';

describe('AutopartsComponent', () => {
  let component: AutopartsComponent;
  let fixture: ComponentFixture<AutopartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutopartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutopartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
