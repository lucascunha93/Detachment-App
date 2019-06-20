import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/interfaces/product';

import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-list-user',
  templateUrl: './product-list-user.page.html',
  styleUrls: ['./product-list-user.page.scss'],
})
export class ProductListUserPage {

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

  ionViewCanLeave(){
    this.productsSubscription.unsubscribe();
    this.products = [];
  }

}
