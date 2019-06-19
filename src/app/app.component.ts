import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.initializeApp();

    this.platform.backButton.subscribe(async () => {
      if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
        navigator['app'].exitApp();
      } else if (this.router.url === '/tabs/home' || this.router.url === '/login') {
        this.presentToast('Pressione voltar novamente para sair do app.');
        this.lastTimeBackPress = new Date().getTime();
      };
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
  
}
