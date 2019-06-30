import { Product } from 'src/app/interfaces/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from './../services/product.service';
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
  notification: boolean = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private toastCtrl: ToastController,
    private productService: ProductService,
    private authService: AuthService
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

  async verifyChat(id: string){
    
  }

  async verifyNotificationReport(id: string){
    this.productService.getProductsByUser(id).subscribe(data =>{
      if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].notification) {
            this.notification = true;
          }          
        }
      }
    })
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
