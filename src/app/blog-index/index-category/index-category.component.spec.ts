import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexCategoryComponent } from './index-category.component';

describe('IndexCategoryComponent', () => {
  let component: IndexCategoryComponent;
  let fixture: ComponentFixture<IndexCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
