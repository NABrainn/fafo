import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListPlaceholderComponent } from './post-list-placeholder.component';

describe('PostListPlaceholderComponent', () => {
  let component: PostListPlaceholderComponent;
  let fixture: ComponentFixture<PostListPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
