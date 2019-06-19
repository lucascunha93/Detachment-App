import { AuthService } from 'src/app/services/auth.service';
import { FavoriteService } from './../../services/favorite.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform, ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.page.html',
  styleUrls: ['./product-item.page.scss'],
})
export class ProductItemPage {

  private productId: string = null;
  product: Product = {};
  private loading: any;
  private productSubscription: Subscription;
  private userId: string;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private activatedRoute: ActivatedRoute,
    public platform: Platform,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.userId = this.authService.getAuth().currentUser.uid;
    if (this.productId) this.loadProduct();
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      if (!data) {
        this.presentToast('Item não disponível.');
        this.navCtrl.pop();
      } else {
        this.product = data;
      }
    });
  }

  favoriteItem() {
    this.product.id = this.productId;
    this.favoriteService.addProduct(this.userId, this.product);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}