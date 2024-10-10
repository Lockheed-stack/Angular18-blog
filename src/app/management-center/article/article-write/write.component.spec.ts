import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleWriteComponent } from './write.component';

describe('WriteComponent', () => {
  let component: ArticleWriteComponent;
  let fixture: ComponentFixture<ArticleWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleWriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
