import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirebaseApp } from '@angular/fire';
import * as firebase from 'firebase';
import { HttpClient } from "@angular/common/http";

import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';

import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private productId: string = null;
  public product: Product = {};
  private loading: any;
  imagePath: string = '';
  cep: number;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private camera: Camera,
    public http: HttpClient,
    private fb: FirebaseApp
  ) { }

  ngOnInit() { }

  async saveProduct(url) {
    await this.presentLoading();
    this.product.picture = url;
    this.product.userId = this.authService.getAuth().currentUser.uid;
    this.product.userName = this.authService.getAuth().currentUser.displayName;

    if (this.product.picture != '') {
      this.product.createdAt = new Date().getTime();

      try {
        await this.productService.addProduct(this.product);
        await this.loading.dismiss();
        this.product = {};
        this.imagePath = '';
        this.cep = null;
        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao salvar');
        this.loading.dismiss();
      }
    } else {
      this.presentToast('Erro ao salvar imagem');
      this.loading.dismiss();
    }
  }

  public uploadImage() {
    const that = this;
    let date = new Date().getTime();
    let storageRef = this.fb.storage().ref();
    let basePath = '/products/' + this.authService.getAuth().currentUser.uid + date + '.png';
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
          that.saveProduct(downloadURL);
        });
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
}
