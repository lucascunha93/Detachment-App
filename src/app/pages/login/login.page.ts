import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { AuthService } from 'src/app/services/auth.service';

import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public keyboard: Keyboard
  ) { }

  ngOnInit() { }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    } catch (error) {

      let message: string;

      switch (error.code) {

        case 'auth/argument-error':
          message = 'E-mail ou Senha não preenchidos.';
          break;

        case 'auth/wrong-password':
          message = 'Login fornecido incorreto!';
          break;

        case 'auth/user-not-found':
          message = 'Login fornecido incorreto!';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      let message: string;
      console.log(error.code);
      
      switch (error.code) {

        case 'auth/argument-error':
          message = 'Preencha todos os campos.';
          break;

        case 'auth/email-already-in-use':
          message = 'E-mail já cadastrado!';
          break;

        case 'auth/invalid-email':
          message = 'E-mail inválido!';
          break;

        case 'auth/weak-password':
          message = 'Senha fraca, digite uma senha mais difícil!';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
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