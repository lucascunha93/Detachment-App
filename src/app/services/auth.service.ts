import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { User } from '../interfaces/user';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( 
    private afa: AngularFireAuth,
    private facebook: Facebook,
    private googlePlus: GooglePlus ) { }

  login(user: User) {
    return this.afa.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user: User) {
    return this.afa.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  resetPassword(email: string) {
    return this.afa.auth.sendPasswordResetEmail(email);
  }

  signOutFirebase() {
    return this.afa.auth.signOut();
  }

  getAuth() {
    return this.afa.auth;
  }

  signInWithFacebook() {
    return this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        return this.afa.auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken));
      });
  }

  signInWithGoogle() {
    return this.googlePlus.login({
      'webClientId': '854932441609-nt42j5507klni6oh6rj87puufg5u8cd8.apps.googleusercontent.com',
      'offline': true,
      'scopes': 'profile email'
    })
      .then(res => {
        console.log(res);
        
        return this.afa.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      });
  }

  logout() : Promise<any> {
    if (this.afa.auth.currentUser.providerData.length) {
      for (var i = 0; i < this.afa.auth.currentUser.providerData.length; i++) {
        var provider = this.afa.auth.currentUser.providerData[i];

        if (provider.providerId == firebase.auth.GoogleAuthProvider.PROVIDER_ID) { // Se for o gooogle
          // o disconnect limpa o oAuth token e tambem esquece qual conta foi selecionada para o login
          return this.googlePlus.disconnect()
            .then(() => {
              return this.signOutFirebase();
            });
        } else 
        if (provider.providerId == firebase.auth.FacebookAuthProvider.PROVIDER_ID) { // Se for facebook
          return this.facebook.logout()
            .then(() => {
              return this.signOutFirebase();
            })
        } 
      }
    }
    return this.signOutFirebase();
  }
}
