import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: '',
    component: TabPage,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path:'home',
        loadChildren: () => import('../home/home.module').then(m=>m.HomePageModule)
      },
      {
        path: 'to-do-list',
        loadChildren: () => import('../to-do-list/to-do-list.module').then(m=>m.ToDoListPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then(m=>m.AboutPageModule)
      },
      {
        path: 'photos',
        loadChildren: () => import('../photos/photos.module').then(m=>m.PhotosPageModule)
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
