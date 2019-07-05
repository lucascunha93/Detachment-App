import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ChatUser } from './../../interfaces/chatUser';
import { Product } from 'src/app/interfaces/product';
import { User } from './../../interfaces/user';

import { AuthService } from 'src/app/services/auth.service';
import { ChatsService } from './../../services/chats.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { UsersService } from 'src/app/services/users.service';
import { Notify } from 'src/app/interfaces/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public notification: Notify = {};
  public formMessage: FormGroup;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private chatService: ChatsService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
  ) {
    this.formMessage = this.fb.group({
      'message': [null, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])]
    })
  }

  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.params['id'];
    let u = this.authService.getAuth().currentUser;
    this.userService.getUser(u.uid).subscribe(data => {
      if (data.length != 0) {
        this.user = data[0];
      } else {
        this.user.id = u.uid;
        this.user.name = u.displayName;
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
    this.message.idProduct = this.productId;
    this.message.idUser = this.user.id;
    this.message.photoUser = this.user.photo;
    this.message.message = this.formMessage.value.message;
    this.message.createdAt = new Date().getTime();
    this.updateStatusMessages();
    this.chatService.addChat(this.message);
    this.notification.idProduct = this.productId;
    this.notification.photoProduct = this.product.picture;
    this.notification.idUser = this.product.userId;
    this.notification.nameUser = this.user.name;
    this.notification.message = this.message.message;
    this.notification.question = true;
    this.notification.createdAt = new Date().getTime();
    this.notification.visualized = false;
    this.notificationService.addNotification(this.notification);
    this.formMessage.value.message = '';
  }

  addMessageRespost(chat: ChatUser) {
    chat.photoUserPublish = this.user.photo;
    chat.idUserPublish = this.user.id;
    this.chatService.updateChat(chat.id, chat);
    this.notification.idProduct = this.productId;
    this.notification.photoProduct = this.product.picture;
    this.notification.idUser = chat.idUser;
    this.notification.nameUser = this.user.name;
    this.notification.message = chat.messageRespost;
    this.notification.question = false;
    this.notification.createdAt = new Date().getTime();
    this.notification.visualized = false;
    this.notificationService.addNotification(this.notification);
  }

  updateStatusMessages() {
    this.product.messagens += 1;
    this.productService.updateProduct(this.productId, this.product);
  }

}
