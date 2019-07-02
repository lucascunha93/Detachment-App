import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductItemPage } from './product-item.page';

const routes: Routes = [
  {
    path: '',
    component: ProductItemPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [SocialSharing],
  declarations: [ProductItemPage]
})
export class ProductItemPageModule {}
