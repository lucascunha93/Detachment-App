import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { LoadingController, ToastController, Platform } from '@ionic/angular';

import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private loading: any;
  public products = new Array<Product>();
  private productsSubscription: Subscription;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController,
    private platform: Platform,
    private router: Router
  ) {
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      if (data.length != 0) this.products = data;
    });
  }

  ionViewWillEnter() {}

  ionViewDidLeave() {
    this.platform.backButton.subscribe();
    this.productsSubscription.unsubscribe();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async deleteProduct(id: string) {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
