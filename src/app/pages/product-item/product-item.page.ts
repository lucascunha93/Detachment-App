import { User } from './../../interfaces/user';
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

  private productSubscription: Subscription;
  private favoriteSubscription: Subscription;
  private reportSubscription: Subscription;

  private loading: any;
  product: Product = {};

  private userId: User = {};
  private productId: string = null;
  private favoriteId: string = null;
  public reportId: string = null;

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
    this.userId.id = this.authService.getAuth().currentUser.uid;
    if (this.productId) this.loadProduct();
  }

  ionViewCanLeave() {
    this.productSubscription.unsubscribe();
    this.favoriteSubscription.unsubscribe();
    this.reportSubscription.unsubscribe();
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      if (!data) {
        this.presentToast('Item não disponível.');
        this.navCtrl.pop();
      } else {
        this.product = data;
        this.favoriteSubscription = this.favoriteService
          .getFavorite(this.userId, this.productId).subscribe(data => {
            if (data[0] != undefined) {
              this.favoriteId = data[0];
              this.favorite = true;
            }
          });
        this.reportSubscription = this.productService
          .getReportUser(this.productId, this.userId.id).subscribe(data => {
            if (data.length != 0) {
              this.reportId = data[0].id;
              this.report = true;
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
    this.product.report += 1;

    if (this.product.report >= 1) {
      this.product.visibility = false;
      this.productService.updateProduct(this.productId, this.product);
    }
    this.presentToast('Denúncia efetuada. Obrigado por ajudar a melhorar o App.');
    this.productService.addReportProduct(this.userId, this.productId)
  }

  reportBackItem() {
    this.report = false;
    this.product.report -= 1;
    if (this.product.report < 1) {
      this.product.visibility = true;
    }
    this.productService.updateProduct(this.productId, this.product);
    this.productService.deleteReportProduct(this.productId, this.reportId);
    this.presentToast('Denúncia cancelada. Obrigado por ajudar a melhorar o App.')
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, cssClass: 'toastBackground' });
    toast.present();
  }

}