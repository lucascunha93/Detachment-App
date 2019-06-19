import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

import { Product } from 'src/app/interfaces/product';
import { HttpClient } from '@angular/common/http';
import { FirebaseApp } from '@angular/fire';
import * as firebase from 'firebase';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage {
  private productId: string = null;
  public product: Product = {};
  private loading: any;
  private productSubscription: Subscription;
  cep: number;
  imagePath: string = '';

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private camera: Camera,
    private http: HttpClient,
    private fb: FirebaseApp
  ) { }

  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.params['id'];

    if (this.productId) this.loadProduct();
  }

  ionViewWillLeave() {
    if (this.productSubscription) this.productSubscription.unsubscribe();
    this.product = {};
    this.imagePath = '';
    this.cep = null;
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
    });
  }

  public uploadImage() {
    if (this.imagePath != '') {

      const that = this;
      let storageRef = this.fb.storage().ref();
      let basePath = '/products/';
      console.log(this.product.picture);

      if (this.product.picture) {
        basePath = basePath + this.product.picture;
      } else {
        let date = new Date().getTime();
        basePath = basePath + this.authService.getAuth().currentUser.uid + date + '.png';
      }
      let uploadTask = storageRef.child(basePath).putString(this.imagePath, 'data_url');

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress + "% done");
        },
        (error) => {
          console.error(error);
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            that.updateProduct(downloadURL);
          });
        });
    } else {
      this.updateProduct(this.product.picture);
    }
  }

  async updateProduct(url) {
    await this.presentLoading();
    this.product.picture = url;
    this.product.createdAt = new Date().getTime();

    try {
      await this.productService.updateProduct(this.productId, this.product);
      await this.loading.dismiss();
     this.navCtrl.navigateBack('/home');
    } catch (error) {
      this.presentToast('Erro ao salvar');
      this.loading.dismiss();
    }
  }

  deletarItem() {
    this.productService.deleteProduct(this.productId);
    this.navCtrl.navigateForward('/product-list-user');
  }

  itemDoado() {
    this.product.visibility = false;
    this.productService.updateProduct(this.productId, this.product);
    this.navCtrl.navigateBack('/home');
  }

  openCamera() {
    this.imagePath = '';

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 100,
      targetHeight: 100
    }

    this.camera.getPicture(options)
      .then((imageData) => {
        let base64image = 'data:image/jpeg;base64,' + imageData;
        this.imagePath = base64image;
      }, (err) => {
        // Handle error
      });
  }

  buscaCep() {
    this.http.get<any>(`https://viacep.com.br/ws/${this.cep}/json/`)
      .subscribe(cep => {
        this.product.state = cep.uf;
        this.product.city = cep.localidade
      });
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
