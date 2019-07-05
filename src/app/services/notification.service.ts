import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Notify } from '../interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifyCollection: AngularFirestoreCollection<Notify>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.notifyCollection = this.afs.collection<Notify>('Notifications');
  }

  addNotification(notify: Notify) { // Adiciona o usuário no firebase
    return this.notifyCollection.add(notify);
  }

  getNotification(idN: string) { // Pegar Usuário no banco
    return this.afs.collection<Notify>('Notifications', ref => ref.where('idUser', '==', idN).orderBy('createdAt', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.idN = a.payload.doc.id;
            return data;
          })
        })
      );
  }

  updateNotification(idN: string, notify: Notify) { // Atualiza o Usuário no firebase
    return this.notifyCollection.doc<Notify>(idN).update(notify);
  }
}
