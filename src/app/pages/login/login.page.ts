import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor( public router: Router ) { }

  ionViewWillEnter(){
   console.log(this.router.url);
  }

  setSignin(){
    this.router.navigate(['signin']);
  }

  setSignup(){
    this.router.navigate(['signup']);
  }

}