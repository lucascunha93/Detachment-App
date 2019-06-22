import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal2.component.html',
  styleUrls: ['./modal2.component.scss'],
})
export class ModalComponent2 {

  constructor(
    private modalController: ModalController,
    ) {}

  async myDismiss() {
    await this.modalController.dismiss();
  }

}
