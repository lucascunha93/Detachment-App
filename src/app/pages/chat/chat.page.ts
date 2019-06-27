import { User } from './../../interfaces/user';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { ChatUser } from './../../interfaces/chatUser';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {

  public chat = new Array<ChatUser>();
  public message: ChatUser = {};
  public chatSubscription: Subscription;
  public productSubscription: Subscription;
  public noChat: boolean = false;
  public product: Product = {};
  public productId: string;
  public user: any = {};

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ionViewWillEnter() {
    this.user = this.authService.getAuth().currentUser;
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
    })
    this.chatSubscription = this.productService.getChat(this.productId).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].idUser == this.user.uid) {
          data[i].userPublish = 'userTrue';    
        }
      }
      this.chat = data;
      if (data.length == 0) {
        setTimeout(() => {
          this.noChat = true;
        }, 2000);
      }
    });
    console.log(this.user.uid);
    
  }

  ionViewDidLeave() {
    this.chatSubscription.unsubscribe();
    this.chat = [];
  }

  addMessage() {
    this.message.idUser = this.user.uid;
    this.message.userName = this.product.userName;
    this.message.photoUser = this.user.photoURL;
    this.message.userPublish = 'userFalse';
    this.message.createdAt = new Date().getTime();
    this.productService.addChat(this.productId, this.message);
  }

}
