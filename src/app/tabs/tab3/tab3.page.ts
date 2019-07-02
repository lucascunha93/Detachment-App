import { UsersService } from './../../services/users.service';
import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirebaseApp } from '@angular/fire';
import * as firebase from 'firebase';
import { HttpClient } from "@angular/common/http";

import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';

import { Product } from 'src/app/interfaces/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private user: any = {};
  public product: Product = {};
  private loading: any;
  public formResgisterItem: FormGroup;
  cep: number;
  imagePath: string = '';
  state: string = '';
  city: string = '';
  phone: number = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UsersService,
    private toastCtrl: ToastController,
    private camera: Camera,
    public http: HttpClient,
    private fb: FirebaseApp,
    public actionSheetController: ActionSheetController
  ) {
    this.formResgisterItem = this.formBuilder.group({
      'name': [null, Validators.compose([
        Validators.required,
      ])],
      'description': [null, Validators.compose([
        Validators.required,
      ])],
      'phone': [null, Validators.compose([
        Validators.required
      ])]
    })
  }

  ionViewWillEnter() {
    let u = this.authService.getAuth().currentUser;
    this.userService.getUser(u.uid).subscribe(data => {
      if (data.length != 0) {
        this.user = data[0];
        this.city = data[0].city;
        this.state = data[0].state;
        this.phone = data[0].phone;
      } else {
        this.user = u;
      }
    })
  }

  ionViewWillLeave() {
    this.formResgisterItem.reset();
    this.product = {};
    this.imagePath = '';
    this.state = '';
    this.city = '';
    this.phone = null;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Inserir foto',
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.openCamera();
        }
      }, {
        text: 'Galeria',
        icon: 'images',
        handler: () => {
          this.openGalery();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async saveProduct(url: string) {
    await this.presentLoading('Publicando item...');
    this.product = this.formResgisterItem.value;
    this.product.picture = url;
    this.product.userId = this.user.id;
    this.product.userName = this.user.name;
    this.product.city = this.city;
    this.product.state = this.state;
    this.product.visibility = true;
    this.product.report = 0;
    this.product.messagens = 0;
    this.product.views = 0;
    this.product.like = 0;

    if (this.product.picture != '') {
      this.product.createdAt = new Date().getTime();

      try {
        await this.loading.dismiss();
        
        await this.productService.addProduct(this.product);
        this.product = {};
        this.imagePath = '';
        this.city = '';
        this.state = '';
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
    if (this.imagePath == '') {
      this.presentToast('Sem foto não é permitido!');
      this.loading.dismiss();
    } else {
      this.presentLoading('Salvando Foto...');
      const that = this;
      let date = new Date().getTime();
      let storageRef = this.fb.storage().ref();
      let basePath = '/products/' + this.user.uid + date + '.png';
      let uploadTask = storageRef.child(basePath).putString(this.imagePath, 'data_url');

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress + "% done");
        },
        (error) => {
          this.loading.dismiss();
          console.error(error);
        }, function () {
          that.loading.dismiss();
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            that.saveProduct(downloadURL);
          });
        });
    }
  }
  async presentLoading(msg: string) {
    this.loading = await this.loadingCtrl.create({ message: msg });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  openCamera() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 250,
      targetHeight: 250
    }

    this.camera.getPicture(options)
      .then((imageData) => {
        let base64image = 'data:image/jpeg;base64,' + imageData;
        this.imagePath = base64image;
      }, (err) => {
        // Handle error
      });
  }

  openGalery() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      targetWidth: 250,
      targetHeight: 250
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
    this.http.get<any>(`https://viacep.com.br/ws/${this.formResgisterItem.value.cep}/json/`)
      .subscribe(cep => {
        this.city = cep.localidade;
        this.state = cep.uf;
      });
  }
}
