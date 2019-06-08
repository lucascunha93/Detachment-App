import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  private loading: any;

  public formRegister: any;
  messageName = "";
  messageEmail = "";
  messagePassword = "";
  errorName = false;
  errorEmail = false;
  errorPassword = false;

  constructor(
    fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    ) {
    this.formRegister = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20), 
        Validators.required])]
    })
  }

  ngOnInit() {
  }

  validAndRegister() {
    let { name, email, password } = this.formRegister.controls;

    if (!this.formRegister.valid) {
      if (!name.valid) {
        this.errorName = true;
        this.messageName = "Opa! Qual seu nome?";
      } else {
        this.messageEmail = "";
      }

      if (!email.valid) {
        this.errorEmail = true;
        this.messageEmail = "Ops! Email inválido";
      } else {
        this.messageEmail = "";
      }

      if (!password.valid) {
        this.errorPassword = true;
        this.messagePassword ="A senha precisa ter de 6 a 20 caracteres"
      } else {
        this.messagePassword = "";
      }
    }
    else {
      this.register();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.formRegister);
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
