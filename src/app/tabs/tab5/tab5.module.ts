import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ModalComponentModule } from 'src/app/components/modal/modal.module';
import { IonicModule } from '@ionic/angular';

import { Tab5Page } from './tab5.page';
import { ModalComponent2Module } from 'src/app/components/modal2/modal2.module';

const routes: Routes = [
  {
    path: '',
    component: Tab5Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalComponentModule,
    ModalComponent2Module,
    RouterModule.forChild(routes)
  ],
  declarations: [Tab5Page]
})
export class Tab5PageModule {}
