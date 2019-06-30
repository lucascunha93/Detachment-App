import { ChatsService } from './../../services/chats.service';
import { User } from './../../interfaces/user';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { ChatUser } from './../../interfaces/chatUser';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

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
  public user: User = {};
  public isUserPublish: boolean = false;
  public respost: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private chatService: ChatsService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService
  ) { }

  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.params['id'];
    let u = this.authService.getAuth().currentUser;
    this.userService.getUser(u.uid).subscribe(data => {
      if (data.length != 0) {
        this.user = data[0];
      } else {
        this.user.id = u.uid;
        this.user.photo = u.photoURL;
      }
    })
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
      if (u.uid == this.product.userId) {
        this.isUserPublish = true;
      }
    })
    this.chatSubscription = this.chatService.getChat(this.productId).subscribe(data => {
      this.chat = data;
      this.verifyNotification();
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

  verifyNotification(){
    for (let i = 0; i < this.chat.length; i++) {
      if (this.chat[i].idUser == this.user.id) {
        if (this.chat[i].respost && !this.chat[i].visualized) {
          this.updateVisualizedUser(this.chat[i]);
        }
      }
    }
  }

  addMessage() {
    this.message.idProduct = this.productId;
    this.message.idUser = this.user.id;
    this.message.photoUser = this.user.photo;
    this.message.createdAt = new Date().getTime();
    this.message.notification = true;
    this.message.respost = false;
    this.message.visualized = false;
    this.updateStatusMessages();
    this.chatService.addChat(this.message);
    this.message.message = '';
  }

  addMessageRespost(chat: ChatUser){
    chat.photoUserPublish = this.user.photo;
    chat.idUserPublish = this.user.id;
    chat.notification = false;
    chat.respost = true;
    console.log(chat);
    
    this.chatService.updateChat(chat.id, chat);
  }

  updateStatusMessages() {
    this.product.messagens += 1;
    this.productService.updateProduct(this.productId, this.product);
  }

  updateVisualizedUser(chat: ChatUser){
    chat.visualized = true;
    this.chatService.updateChat(chat.id, chat);
  }

}
