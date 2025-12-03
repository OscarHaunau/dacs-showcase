import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { RaffleListComponent } from './raffle/list/raffle-list';
import { RaffleDetailComponent } from './raffle/detail/raffle-detail';
import { TermsComponent } from './terms/terms';
import { AdminComponent } from './admin/admin';
import { ProfileComponent } from './profile/profile';
import { DomainDemoComponent } from './domain/demo/domain-demo';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'raffle', component: RaffleListComponent },
  { path: 'raffle/:id', component: RaffleDetailComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/purchases', loadComponent: () => import('./profile/purchases/purchases').then(m => m.PurchasesComponent) },
  { path: 'domain', component: DomainDemoComponent },
  { path: 'checkout/:id/:number', loadComponent: () => import('./checkout/checkout').then(m => m.CheckoutComponent) },
  { path: 'admin/new', loadComponent: () => import('./admin/sorteo-form/sorteo-form').then(m => m.SorteoFormComponent), canActivate: [adminGuard] },
  { path: 'admin/:id/edit', loadComponent: () => import('./admin/sorteo-form/sorteo-form').then(m => m.SorteoFormComponent), canActivate: [adminGuard] },
  { path: 'admin/:id/resultado', loadComponent: () => import('./admin/result/result').then(m => m.AdminResultComponent), canActivate: [adminGuard] },
  { path: 'admin/:id', component: AdminComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
