import {inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ScheduledBrewingComponent} from "./scheduled-brewing.component";
import {LoginService} from "../../login/login.service";
import {NewBrewingComponent} from "./new-brewing/new-brewing.component";
import {ScheduledItemComponent} from "./scheduled-item/scheduled-item.component";
import {MatSortModule} from "@angular/material/sort";
import {ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  { path: '', component: ScheduledBrewingComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
  { path: 'new', component: NewBrewingComponent, canActivate: [() => inject(LoginService).isLoggedIn()]}
]

@NgModule({
  declarations: [
    NewBrewingComponent,
    ScheduledItemComponent,
    ScheduledBrewingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatSortModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule]
})
export class ScheduledBrewingModule { }
