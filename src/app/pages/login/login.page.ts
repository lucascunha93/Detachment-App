import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(
    public router: Router,
    public platform: Platform
  ) {
    this.platform.backButton.subscribe(async () => {
      if (this.router.url === '/login') {
        navigator['app'].exitApp();
      }
    })
  }

  setSignin() {
    this.router.navigate(['signin']);
  }

  setSignup() {
    this.router.navigate(['signup']);
  }

}