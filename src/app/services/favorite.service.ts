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

  getProducts(id) {
    return this.productsCollection.doc<Product>(id).collection('Favorites')
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return { ...data };
          });
        })
      );
  }

  getProductsFavorites(id) {
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

  addProduct(id, product: Product) {
    return this.productsCollection.doc(id).collection('Favorites').add(product);
  }

  deleteFavorite(id, idFavorite) {
    return this.productsCollection.doc(id).collection('Favorites').doc(idFavorite).delete();
  }

}