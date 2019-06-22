import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

import { ModalComponent } from './modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
     declarations: [
       ModalComponent
     ],
     imports: [
       IonicModule,
       CommonModule,
       ReactiveFormsModule
     ],
     entryComponents: [
       ModalComponent
     ]
})
export class ModalComponentModule {}