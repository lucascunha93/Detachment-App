import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  private loading: any;

  public formLogin: any;
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
  ) { }

  ngOnInit() {
  }

}
