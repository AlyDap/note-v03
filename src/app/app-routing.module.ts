import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'info/:id', //tambahkan parameter id
    loadChildren: () =>
      import('./info/info.module').then((m) => m.InfoPageModule),
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit/edit.module').then(m => m.EditPageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
