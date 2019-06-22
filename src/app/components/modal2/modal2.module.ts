import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

import { ModalComponent2 } from './modal2.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
     declarations: [
       ModalComponent2
     ],
     imports: [
       IonicModule,
       CommonModule
     ],
     entryComponents: [
       ModalComponent2
     ]
})
export class ModalComponent2Module {}