import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: './tab1/tab1.module#Tab1PageModule'
          }
        ]
      },
      {
        path: 'favorites',
        children: [
          {
            path: '',
            loadChildren: './tab2/tab2.module#Tab2PageModule'
          }
        ]
      },
      {
        path: 'publish',
        children: [
          {
            path: '',
            loadChildren: './tab3/tab3.module#Tab3PageModule'
          }
        ]
      },
      {
        path: 'publish/:id',
        children: [
          {
            path: '',
            loadChildren: './tab3/tab3.module#Tab3PageModule'
          }
        ]
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: './tab4/tab4.module#Tab4PageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
