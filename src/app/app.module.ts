import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BrewingModule } from './brewing/brewing.module';
import { LoginModule } from './login/login.module';
import { NotFoundComponent } from './NotFound/not-found.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

export let routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    BrewingModule,
    RouterModule.forRoot(routes),
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
