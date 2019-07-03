import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  notify: boolean = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private notificationService: NotificationService
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

  ionViewWillEnter() {
    let u = this.authService.getAuth().currentUser.uid;
    this.verifyNotificationReport(u);
  }


  async verifyNotificationReport(id: string) {
    let cont: number = 0;
    this.notificationService.getNotification(id).subscribe(data => {
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].visualized == false) {
            cont++;
          }
        }
        if (cont == 0) {
          this.notify = false;
        } else {
          this.notify = true;
        }
      } else {
        this.notify = false;
      }
    })
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
