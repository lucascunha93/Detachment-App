import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { ChatUser } from './../interfaces/chatUser';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  private chatsCollection: AngularFirestoreCollection<ChatUser>;

  constructor(private afs: AngularFirestore) {
    this.chatsCollection = this.afs.collection<ChatUser>('ChatUsers');
  }

  addChat(chat: ChatUser) { // Cria um novo chat do produto
    return this.chatsCollection.add(chat);
  }

  getChat(idChatUser: string) { // Busca chat no produto
    return this.afs.collection<ChatUser>('ChatUsers', ref => ref.where('idProduct', '==', idChatUser)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return { ...data };
        })
      }));
  }

  getChats(idChatUser: string) { // Busca chat no produto
    return this.chatsCollection.doc<ChatUser>(idChatUser)
      .collection('chatUsers', ref => ref.orderBy('createdAt') ).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return { ...data };
        })
      }));
  }

  updateChat(idChat: string, chat: ChatUser){ // atualiza os chats do produto
    return this.afs.collection('ChatUsers').doc(idChat).update(chat);
  }

}
