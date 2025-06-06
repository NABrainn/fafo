import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StooqDisplayPlaceholderComponent } from './stooq-display-placeholder.component';

describe('StooqDisplayPlaceholderComponent', () => {
  let component: StooqDisplayPlaceholderComponent;
  let fixture: ComponentFixture<StooqDisplayPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StooqDisplayPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StooqDisplayPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
