import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsPage } from './donations.page';

describe('DonationsPage', () => {
  let component: DonationsPage;
  let fixture: ComponentFixture<DonationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
