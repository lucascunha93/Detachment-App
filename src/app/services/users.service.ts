import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersCollection: AngularFirestoreCollection<User>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.usersCollection = this.afs.collection<User>('Users');
  }

  addUser(user: User) { // Adiciona o usuário no firebase
    return this.usersCollection.add(user);
  }

  getUser(idU: string) { // Pegar Usuário no banco
    return this.afs.collection<User>('Users', ref => ref.where('id', '==', idU))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.idU = a.payload.doc.id;
            return data;
          })
        })
      );
  }

  updateUser(idUser: string, user: User) { // Atualiza o Usuário no firebase
    return this.usersCollection.doc<User>(idUser).update(user);
  }

}
