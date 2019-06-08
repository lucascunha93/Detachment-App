import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { log } from 'util';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  private loading: any;
  public formLogin: FormGroup;

  constructor(
      private fb: FormBuilder,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private authService: AuthService) {
        this.formLogin = this.fb.group({
          'email': [null, Validators.compose([
            Validators.required,
            Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
          ])],
          'password': [null, Validators.compose([
            Validators.required,
            Validators.minLength(5)
          ])]
        })
    }

  ngOnInit() {
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.formLogin.value);
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
