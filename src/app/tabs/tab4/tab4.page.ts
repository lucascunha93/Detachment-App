import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

import { ProductService } from 'src/app/services/product.service';

import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

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
