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
  public isUserPublish: boolean = false;
  public respost: string = '';

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
      if (this.user.uid == this.product.userId) {
        this.isUserPublish = true;
      }
    })
    this.chatSubscription = this.productService.getChat(this.productId).subscribe(data => {
      this.chat = data;
      if (data.length == 0) {
        setTimeout(() => {
          this.noChat = true;
        }, 2000);
      }
    });
  }

  ionViewDidLeave() {
    this.chatSubscription.unsubscribe();
    this.chat = [];
  }

  addMessage() {
    this.message.idUser = this.user.uid;
    this.message.photoUser = this.user.photoURL;
    this.message.createdAt = new Date().getTime();
    this.message.notification = true;
    this.updateStatusMessages();
    this.productService.addChat(this.productId, this.message);
    this.message.message = '';
  }

  addMessageRespost(chat: ChatUser){
    chat.photoUserPublish = this.user.photoURL;
    chat.idUserPublish = this.user.uid;
    this.productService.updateChat(this.productId, chat.id, chat);
  }

  updateStatusMessages() {
    this.product.messagens += 1;
    this.productService.updateProduct(this.productId, this.product);
  }

}
