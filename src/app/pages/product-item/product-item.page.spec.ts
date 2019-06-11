import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemPage } from './product-item.page';

describe('ProductItemPage', () => {
  let component: ProductItemPage;
  let fixture: ComponentFixture<ProductItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
