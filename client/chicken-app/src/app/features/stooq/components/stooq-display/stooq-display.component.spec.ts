import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StooqDisplayComponent } from './stooq-display.component';

describe('StooqDisplayComponent', () => {
  let component: StooqDisplayComponent;
  let fixture: ComponentFixture<StooqDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StooqDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StooqDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
