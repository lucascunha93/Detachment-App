import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent2 } from './modal2.component';

describe('ModalComponent2', () => {
  let component: ModalComponent2;
  let fixture: ComponentFixture<ModalComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent2 ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
