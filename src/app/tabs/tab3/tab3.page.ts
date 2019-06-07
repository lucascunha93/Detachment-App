import { map } from 'rxjs/operators';
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
  private productSubscription: Subscription;
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
  ) {
    this.productId = this.activatedRoute.snapshot.params['id'];

    if (this.productId) this.loadProduct();
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.productSubscription) this.productSubscription.unsubscribe();
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
    });
  }

  async saveProduct(url) {
    await this.presentLoading();
    this.product.picture = url;
    this.product.userId = this.authService.getAuth().currentUser.uid;

    if (this.productId) {
      try {
        await this.productService.updateProduct(this.productId, this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    } else {
      if (this.product.picture != '') {
        this.product.createdAt = new Date().getTime();

        try {
          await this.productService.addProduct(this.product);
          await this.loading.dismiss();
          this.
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
  }

  public uploadImage() {
    const that = this;
    let storageRef = this.fb.storage().ref();
    let basePath = '/products/' + this.authService.getAuth().currentUser.uid + '/' + this.authService.getAuth().currentUser.uid + '.png';
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
     .subscribe( cep => {
       this.product.state = cep.uf;
       this.product.city = cep.localidade
     } );
    // const cepValue = this.contatoForm.controls['cep'].value;
    // const isValid = this.contatoForm.controls['cep'].valid;
    // if(isValid) {
    //   this.http.get(`https://viacep.com.br/ws/${cepValue}/json/`)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     console.log(data);
    //   })
    // }
  }

}
