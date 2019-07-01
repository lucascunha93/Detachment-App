import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

import { Notify } from 'src/app/interfaces/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  public notifications = new Array<Notify>();
  private notificationSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private noticationService: NotificationService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    let userId = this.authService.getAuth().currentUser.uid;
    this.notificationSubscription = this.noticationService.getNotification(userId).subscribe(data => {
      this.notifications = data;
    })
  }

  ionViewDidLeave() {
    this.notificationSubscription.unsubscribe();
    this.notifications = [];
  }

  openNotification(notification: Notify){
    notification.visualized = true;
    this.noticationService.updateNotification(notification.idN, notification);
    this.router.navigate(['/chat', notification.idProduct]);
  }

  getClass(classe: boolean){
    if (classe) {
      return 'not-visualized';
    }
  }

}
