import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {  HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ProductEditPage } from './product-edit.page';
import { BrMaskerModule } from 'br-mask';

const routes: Routes = [
  {
    path: '',
    component: ProductEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductEditPage]
})
export class ProductEditPageModule {}
