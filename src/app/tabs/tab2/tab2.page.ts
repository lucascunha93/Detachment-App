import { AuthService } from 'src/app/services/auth.service';
import { FavoriteService } from './../../services/favorite.service';
import { Component } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private userId;
  public products = new Array<Product>();
  private productsSubscription: Subscription;

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  ionViewWillEnter() {
    this.userId = this.authService.getAuth().currentUser.uid;
    this.productsSubscription = this.favoriteService.getFavorites(this.userId).subscribe(data => {
      if (data) {
        this.products = data;
      } else {
        this.products = [];
      }
    });
  }

  ionViewWillLeave() {
    this.productsSubscription.unsubscribe();
    this.products = [];
  }

  removeFavorite(idItem: string) {
    this.favoriteService.deleteFavorite(this.userId, idItem)
    this.presentToast('Favorito removido.');
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
