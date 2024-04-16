import {inject, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { NotFoundComponent } from './NotFound/not-found.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {LoginService} from "./login/login.service";

export let routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'inventory',
    canActivate: [() => inject(LoginService).isLoggedIn()],
    loadChildren: () => import('./brewing/inventory/inventory.module').then(m => m.InventoryModule),
  },
  {
    path: 'recipes',
    canActivate: [() => inject(LoginService).isLoggedIn()],
    loadChildren: () => import('./brewing/recipes/recipes.module').then(m => m.RecipesModule),
  },
  {
    path: 'scheduled-brewing',
    canActivate: [() => inject(LoginService).isLoggedIn()],
    loadChildren: () => import('./brewing/scheduled-brewing/scheduled-brewing.module').then(m => m.ScheduledBrewingModule),
  },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    RouterModule.forRoot(routes),
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
