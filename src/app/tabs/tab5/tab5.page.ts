import { ModalComponent2 } from './../../components/modal2/modal2.component';
import { ModalComponent } from './../../components/modal/modal.component';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page {

  public userName: string = '';
  private loading: any;
  public photoUser: string = '';

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) { }

  ionViewWillEnter() {
    this.userName = this.authService.getAuth().currentUser.displayName;
    this.photoUser = this.authService.getAuth().currentUser.photoURL;
  }

  async logout() {
    await this.presentLoading();

    try {
      await this.authService.signOutFirebase();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async openModal1() {
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ModalComponent,
      });

    await modal.present();
  }

  async openModal2() {
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ModalComponent2,
      });

    await modal.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }
}
