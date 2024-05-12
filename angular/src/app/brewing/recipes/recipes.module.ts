import {inject, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes.component";
import {LoginService} from "../../login/login.service";
import {NewRecipeComponent} from "./new-recipe/new-recipe.component";
import {EditRecipeComponent} from "./edit-recipe/edit-recipe.component";
import {RecipeCardComponent} from "./recipe-card/recipe-card.component";
import {RecipeFormComponent} from "./recipe-form/recipe-form.component";
import {FirstCapDirective} from "./first-cap.directive";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  { path: '', component: RecipesComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
  { path: 'new', component: NewRecipeComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
  { path: ':recipeId', component: EditRecipeComponent, canActivate: [() => inject(LoginService).isLoggedIn()]},
];

@NgModule({
  declarations: [
    EditRecipeComponent,
    NewRecipeComponent,
    RecipeCardComponent,
    RecipeFormComponent,
    RecipesComponent,
    FirstCapDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,

  ],
  exports: [RouterModule]
})
export class RecipesModule { }
