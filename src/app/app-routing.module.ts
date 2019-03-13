import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/search/search.module#SearchModule',
  },
  // {
  //   path: '',
  //   loadChildren: './pages/landing/landing.module#LandingModule',
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
