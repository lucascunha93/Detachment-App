import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.platform.backButton.subscribe(async () => {
      if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
        navigator['app'].exitApp();
      } else if (this.router.url === '/tabs/home' || this.router.url === '/login') {
        this.presentToast('Pressione voltar novamente para sair.');
        this.lastTimeBackPress = new Date().getTime();
      } else {
        this.router.navigate(['/home']);
      };
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
