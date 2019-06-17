import { AuthService } from './../../services/auth.service';
import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  public formReset: FormGroup;

  constructor(
    private fb: FormBuilder,
    public popoverCotroller: PopoverController,
    private authService: AuthService
  ) {
    this.formReset = this.fb.group({
      'email': [null, Validators.compose([
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])]
    })
  }

  resetPassword() {
    this.authService.resetPassword(this.formReset.value['email']);
  }

  ngOnInit() { }

}
