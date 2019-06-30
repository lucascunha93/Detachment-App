import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileEditPage } from './profile-edit.page';
import { FormsModule } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';

const routes: Routes = [
  {
    path: '',
    component: ProfileEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileEditPage]
})
export class ProfileEditPageModule {}
