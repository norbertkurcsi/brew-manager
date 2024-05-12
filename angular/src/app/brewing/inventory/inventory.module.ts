import {inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {InventoryComponent} from "./inventory.component";
import {LoginService} from "../../login/login.service";
import {NewElementComponent} from "./new-element/new-element.component";
import {EditIngredientComponent} from "./edit-ingredient/edit-ingredient.component";
import {FilterComponent} from "./filter/filter.component";
import {InventoryElement} from "./inventory-element/inventory-element.component";
import {PaginationComponent} from "./pagination/pagination.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSortModule} from "@angular/material/sort";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";

let routes: Routes = [
  { path: '', component: InventoryComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
  { path: 'new', component: NewElementComponent, canActivate: [() => inject(LoginService).isLoggedIn()]},
  { path: ':ingId', component: EditIngredientComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
];

@NgModule({
  declarations: [
    EditIngredientComponent,
    FilterComponent,
    InventoryComponent,
    InventoryElement,
    NewElementComponent,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule
  ],
  exports: [RouterModule]
})
export class InventoryModule { }
