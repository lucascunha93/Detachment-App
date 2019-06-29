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

  login(user: User) { // Logar com email e senha no firebase
    return this.afa.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user: User) { // Cadastrar email e senha no login com firebase
    return this.afa.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  resetPassword(email: string) { // Resetar senha do email cadastrado no firebase
    return this.afa.auth.sendPasswordResetEmail(email);
  }

  signOutFirebase() { // Deslogar do firebase
    return this.afa.auth.signOut();
  }

  getAuth() { // Pegar usuário autenticado
    return this.afa.auth;
  }

  signInWithFacebook() { // login com o Facebook
    return this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        return this.afa.auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken));
      });
  }

  signInWithGoogle() { // login com o Google
    return this.googlePlus.login({
      'webClientId': '854932441609-nt42j5507klni6oh6rj87puufg5u8cd8.apps.googleusercontent.com',
      'offline': true,
      'scopes': 'profile email'
    })
      .then(res => {
        return this.afa.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      });
  }

  logout() : Promise<any> { // Verificar como está logado e deslogar
    if (this.afa.auth.currentUser.providerData.length) {
      for (var i = 0; i < this.afa.auth.currentUser.providerData.length; i++) {
        var provider = this.afa.auth.currentUser.providerData[i];

        if (provider.providerId == firebase.auth.GoogleAuthProvider.PROVIDER_ID) { // Se for o gooogle
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
    return this.signOutFirebase(); // Se tiver logado com e-mail e senha
  }
}
