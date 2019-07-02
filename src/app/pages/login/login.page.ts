import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private loading: any;
  public formLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    public popoverController: PopoverController,
    private router: Router
    ) {
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

  openCadastro(){
    this.router.navigate(['/signup']);
  }

  async login() { // Login com email e senha no firebase
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


  signInWithGoogle() { // Login com Google

    let message: string;

    this.authService.signInWithGoogle()
      .then(() => {
        message = 'Você entrou com Google.';
        this.presentToast(message);
      })
      .catch((error) => {
        message = 'Erro ao efeituar o login.';
        console.log(error);
        this.presentToast(message);
      });
  }

  signInWithFacebook() { // Login com Facebook

    let message: string;

    this.authService.signInWithFacebook()
      .then(() => {
        message = 'Você entrou com Facebook.';
        this.presentToast(message);
      })
      .catch((error) => {
        message = 'Erro ao efeituar o login.';
        this.presentToast(message);
      });
  }

  async presentPopover(event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
    });
    return await popover.present();
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