import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseApp } from '@angular/fire';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage {

  public user: any = [];
  public formProfile: FormGroup;
  imagePath: string = '';
  isActiveToggleTextPassword: Boolean = true;
  photoEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private camera: Camera,
    private fb: FirebaseApp,
    public actionSheetController: ActionSheetController
  ) {
    this.formProfile = this.formBuilder.group({
      'name': [null, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      'email': [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])],
      'password': [null, Validators.compose([
        Validators.minLength(6),
        Validators.required,
      ])],
      'passwordNew': [null, Validators.compose([
        Validators.minLength(6),
      ])]
    })
  }

  public ionViewWillEnter() {
    this.user = this.authService.getAuth().currentUser;
  }

  editProfile() {
    let userToken = this.authService.getAuth().currentUser;
    // let credential = firebase.auth.EmailAuthProvider.credential(this.user.email, this.formProfile.value.password);
    // userToken.reauthenticateWithCredential(credential);
    
    if (this.imagePath != '') {
      userToken.photoURL = this.imagePath;
    }

    if(this.formProfile.value.name != this.user.displayName ){
      userToken.updateProfile({
        displayName: this.formProfile.value.name
      })
    }

    // if(this.formProfile.value.email != this.user.email ){
    //   userToken.updateEmail(this.formProfile.value.email);
    // }

    // if(this.formProfile.value.password != null ){
    //   userToken.updatePassword(this.formProfile.value.password);
    // }

    this.presentToast('Perfil atualizado com sucesso!');
    
  }

  public toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }
  public getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  public removePhoto(){
    this.photoEdit = false;
    this.imagePath = '';
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

  public openCamera() {

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
        this.photoEdit = true;
      }, (err) => {
        // Handle error
      });
  }

  public openGalery() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    this.camera.getPicture(options)
      .then((imageData) => {
        let base64image = 'data:image/jpeg;base64,' + imageData;
        this.imagePath = base64image;
        this.photoEdit = true;
      }, (err) => {
        // Handle error
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }


}
