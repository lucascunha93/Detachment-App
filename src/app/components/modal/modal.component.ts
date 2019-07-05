import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {

  formContact: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    ) {
    this.formContact = this.formBuilder.group({
      'name': [null, Validators.compose([
        Validators.required,
      ])],
      'description': [null, Validators.compose([
        Validators.required,
      ])]
    })
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
