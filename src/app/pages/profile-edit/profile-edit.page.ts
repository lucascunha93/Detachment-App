import { User } from './../../interfaces/user';
import { UsersService } from './../../services/users.service';
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage {

  public user: any = [];
  public userDb: User = {};
  imagePath: string = '';
  userEmpty: boolean = false;

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private userService: UsersService
  ) { }

  public ionViewWillEnter() {
    this.user = this.authService.getAuth().currentUser;
    this.userService.getUser(this.user.uid).subscribe(data => {
      if (data.length != 0) {
        this.userDb = data[0];
      } else {
        this.userDb.id = this.user.uid;
        this.userDb.name = this.user.displayName;
        this.userDb.photo = this.user.photoURL;
        this.userDb.phone = this.user.phoneNumber;
        this.userDb.email = this.user.email;
        this.userEmpty = true;
      }
    })
  }

  editProfile() {

    if (this.userEmpty) {
      if (this.imagePath != '') {
        this.userDb.photo = this.imagePath;
      }
      this.userService.addUser(this.userDb);
    } else {
      if (this.imagePath != '') {
        this.userDb.photo = this.imagePath;
      }
      this.userService.updateUser(this.userDb.idU, this.userDb)
    }
    this.presentToast('Perfil atualizado com sucesso!');
  }

  public removePhoto() {
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
      }, (err) => {
        // Handle error
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }


}
