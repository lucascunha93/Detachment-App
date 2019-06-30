import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.page.html',
  styleUrls: ['./donations.page.scss'],
})
export class DonationsPage {

  public products = new Array<Product>();
  private productsSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
  ) { }

  ionViewWillEnter() {
    let userId = this.authService.getAuth().currentUser.uid;
    this.productsSubscription = this.productService.getProductsByUser(userId).subscribe(data => {
      this.products = data;
    })
  }

  ionViewDidLeave() {
    this.productsSubscription.unsubscribe();
    this.products = [];
  }

}
