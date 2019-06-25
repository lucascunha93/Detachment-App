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
  public dbError: boolean = false;  

  filter: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private toastCtrl: ToastController,
  ) { }

  ionViewWillEnter() {
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
      if (data.length == 0) {
        setTimeout(() => {
          this.dbError = true;
        }, 2000);
      }
    });
  }

  ionViewDidLeave() {
    console.log('teste');
    this.productsSubscription.unsubscribe();
    this.products = [];
  }

  searchBox() {
    if (this.filter) this.filter = false;
    else this.filter = true;
  }
  
  async deleteProduct(id: string) {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }
  
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
