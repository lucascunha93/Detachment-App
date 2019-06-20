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
  private favoriteSubscription: Subscription;
  private userId: string;
  private favoriteId: string = null;
  public favorite: boolean = false;
  public report: boolean = false;

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

  ionViewCanLeave() {
    this.productSubscription.unsubscribe();
    this.favoriteSubscription.unsubscribe();
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      if (!data) {
        this.presentToast('Item não disponível.');
        this.navCtrl.pop();
      } else {
        this.product = data;
        this.favoriteSubscription = this.favoriteService.getFavorite(this.userId, this.productId).subscribe(data => {
          if (data[0] != undefined) {
            this.favoriteId = data[0];
            this.favorite = true;
          }
        });
      }
    });
  }

  favoriteItem() {
    this.favorite = true;
    this.presentToast('Item favoritado.');
    this.product.id = this.productId;
    this.favoriteService.addProduct(this.userId, this.product);
  }

  removeFavoriteItem() {
    this.favorite = false;
    this.presentToast('Item removido do favoritos.');
    this.favoriteService.deleteFavorite(this.userId, this.favoriteId);
  }

  reportItem() {
    this.report = true;
    this.presentToast('Obrigado por ajudar a melhorar o App.')
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, cssClass: 'toastBackground' });
    toast.present();
  }

}