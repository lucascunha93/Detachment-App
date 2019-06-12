import { AuthService } from 'src/app/services/auth.service';
import { FavoriteService } from './../../services/favorite.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.page.html',
  styleUrls: ['./product-item.page.scss'],
})
export class ProductItemPage implements OnInit {

  private productId: string = null;
  product: Product = {};
  private loading: any;
  private productSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private activatedRoute: ActivatedRoute,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.params['id'];

    if (this.productId) this.loadProduct();
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
    });
  }

  favoriteItem(){
    let userId = this.authService.getAuth().currentUser.uid;
    this.product.id = this.productId;
    console.log(this.productId);
    
    this.favoriteService.addProduct(userId, this.product);
  }

}
