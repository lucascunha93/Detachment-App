import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  public userName: string = '';
  private loading: any;
  public photoUser: string = '';

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) { }

  ionViewWillEnter(){
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

}
