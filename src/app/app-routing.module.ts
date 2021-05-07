import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LayoutComponent } from '@components/layout/layout.component';
import { SignInComponent } from '@components/sign-in/sign-in.component';
import { SignUpComponent } from '@components/sign-up/sign-up.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/home/home.module').then((m) => m.HomeModule),
      },
    ],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
