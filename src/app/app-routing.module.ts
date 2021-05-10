import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LayoutComponent } from '@components/layout/layout.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { AuthGuard } from '@guards/auth/auth.guard';
import { VerifyAccessGuard } from '@guards/verifyAccess/verify-access.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/home/home.module').then((m) => m.HomeModule),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./components/sign-in/sign-in.module').then((m) => m.SignInModule),
    canActivate: [VerifyAccessGuard],
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./components/sign-up/sign-up.module').then((m) => m.SignUpModule),
    canActivate: [VerifyAccessGuard],
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
