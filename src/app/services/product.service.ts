import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Product } from '../interfaces/product';
import { User } from './../interfaces/user';
import { ChatUser } from '../interfaces/chatUser';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Product>('Products');
  }

  getProducts() { // Pegar produtos cadastrados e com visibilidade com atributo true
    return this.afs.collection<Product>('Products', ref => ref.where('visibility', '==', true))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getProductsByUser(idU: string) { // Pegar produtos do usuário
    return this.afs.collection<Product>('Products', ref => ref.where('userId', '==', idU))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data.id = a.payload.doc.id;
            return data;
          })
        })
      );
  }
    
  getProduct(id: string) { // Pega o produto por id
      return this.productsCollection.doc<Product>(id).valueChanges();
  }

  getReportUser(idProduct: string, idUser: string) { // Busca denuncia por usuário
    return this.productsCollection.doc<Product>(idProduct)
      .collection('ReportUsers', ref => ref.where('id', '==', idUser)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return { ...data };
        })
      }));
  }

  getLikeUser(idProduct: string, idUser: string) { // Busca curti por usuário
    return this.productsCollection.doc<Product>(idProduct)
      .collection('likeUsers', ref => ref.where('id', '==', idUser)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          data.id = a.payload.doc.id;
          return { ...data };
        })
      }));
  }

  addProduct(product: Product) { // Adiciona o produto no firebase
    return this.productsCollection.add(product);
  }

  addReportProduct(idUser: User, idProduct: string) { // Adiciona a denuncia ao produto
    return this.productsCollection.doc<Product>(idProduct).collection('ReportUsers').add(idUser);
  }

  addLike(idProduct: string, idUser: User) { // Adiciona um like no produto
    return this.productsCollection.doc<Product>(idProduct).collection('likeUsers').add(idUser);
  }

  updateLike(idProduct: string, idChat: string, chat: ChatUser){ // atualiza os curtis do produto
    return this.productsCollection.doc<Product>(idProduct)
      .collection('likeUsers').doc(idChat).update(chat);
  }

  updateProduct(idProduto: string, product: Product) { // Atualiza o produto no firebase
    return this.productsCollection.doc<Product>(idProduto).update(product);
  }

  deleteProduct(id: string) { // Deleta o produto do firebase 
    return this.productsCollection.doc(id).delete();
  }

  deleteReportProduct(idProduct: string, idReport: string) {
    return this.productsCollection.doc<Product>(idProduct).collection('ReportUsers')
      .doc(idReport).delete();
  }

  deleteLikeProduct(idProduct: string, idLike: string) {
    return this.productsCollection.doc<Product>(idProduct).collection('likeUsers')
      .doc(idLike).delete();
  }

}