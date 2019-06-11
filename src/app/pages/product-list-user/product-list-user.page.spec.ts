import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListUserPage } from './product-list-user.page';

describe('ProductListUserPage', () => {
  let component: ProductListUserPage;
  let fixture: ComponentFixture<ProductListUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
