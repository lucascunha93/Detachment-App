import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Product } from '../interfaces/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private productsCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Product>('FavoritesUser');
  }

  // getProducts(id) { // Busca no banco todos os favoritos do usuário logado
  //   return this.productsCollection.doc<Product>(id).collection('Favorites')
  //     .snapshotChanges().pipe(
  //       map(actions => {
  //         return actions.map(a => {
  //           let data = a.payload.doc.data();
  //           data.id = a.payload.doc.id;
  //           return { ...data };
  //         });
  //       })
  //     );
  // }

  getFavorites(id: string) { // Busca no banco todos os favoritos do usuário logado
    return this.productsCollection.doc<Product>(id).collection('Favorites')
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data();
            data.idRemove = a.payload.doc.id;
            return { ...data };
          });
        })
      );
  }

  getFavorite(idUser: string, idFavorite: string) {
    return this.productsCollection.doc<Product>(idUser).collection('Favorites')
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data();
            if (data.id == idFavorite) {
              return a.payload.doc.id;
            }
          });
        })
      );
  }

  addProduct(id: string, product: Product) {
    return this.productsCollection.doc(id).collection('Favorites').add(product);
  }

  deleteFavorite(idUser: string, idFavorite: string) {
    return this.productsCollection.doc(idUser).collection('Favorites').doc(idFavorite).delete();
  }

}