import { UsersService } from './../../services/users.service';
import { ModalComponent2 } from './../../components/modal2/modal2.component';
import { ModalComponent } from './../../components/modal/modal.component';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page {

  public user: any = {};
  private loading: any;
  public photoUser: string = '';
  public iptEdit: boolean = false;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private userService: UsersService
  ) { }

  ionViewWillEnter() {
    let u = this.authService.getAuth().currentUser;
    this.userService.getUser(u.uid).subscribe(data => {
      if (data.length != 0) {
        this.user = data[0];
        this.photoUser = data[0].photo;
      } else {
        this.user = u;
        this.photoUser = u.photoURL;
      }
    })
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
