import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChickenFactsComponent } from './chicken-facts.component';

describe('ChickenFactsComponent', () => {
  let component: ChickenFactsComponent;
  let fixture: ComponentFixture<ChickenFactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChickenFactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChickenFactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
