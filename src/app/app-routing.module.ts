import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoggedGuard } from './guards/logged.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'home', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [LoggedGuard] },
  { path: 'signin', loadChildren: './pages/signin/signin.module#SigninPageModule', canActivate: [LoggedGuard] },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule', canActivate: [LoggedGuard] },
  { path: 'product-edit/:id', loadChildren: './pages/product-edit/product-edit.module#ProductEditPageModule', canActivate: [AuthGuard] },
  { path: 'product-item/:id', loadChildren: './pages/product-item/product-item.module#ProductItemPageModule', canActivate: [AuthGuard] },
  { path: 'profile-edit', loadChildren: './pages/profile-edit/profile-edit.module#ProfileEditPageModule' },
  { path: 'chat/:id', loadChildren: './pages/chat/chat.module#ChatPageModule' },
  { path: 'donations', loadChildren: './pages/donations/donations.module#DonationsPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
