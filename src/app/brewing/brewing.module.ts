import { inject, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginService } from "../login/login.service";
import { InventoryComponent } from "./inventory/inventory.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ScheduledBrewingComponent } from "./scheduled-brewing/scheduled-brewing.component";
import { HttpClientModule } from '@angular/common/http';
import { InventoryElement } from "./inventory/inventory-element/inventory-element.component";
import { CommonModule } from "@angular/common";
import { FilterComponent } from "./inventory/filter/filter.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSortModule } from "@angular/material/sort";
import { EditIngredientComponent } from "./inventory/edit-ingredient/edit-ingredient.component";
import { NewElementComponent } from "./inventory/new-element/new-element.component";
import { PaginationComponent } from "./inventory/pagination/pagination.component";
import { RecipeCardComponent } from "./recipes/recipe-card/recipe-card.component";
import { NewRecipeComponent } from "./recipes/new-recipe/new-recipe.component";
import { RecipeFormComponent } from "./recipes/recipe-form/recipe-form.component";
import { EditRecipeComponent } from "./recipes/edit-recipe/edit-recipe.component";
import { FirstCapDirective } from "./recipes/first-cap.directive";
import { ScheduledItemComponent } from "./scheduled-brewing/scheduled-item/scheduled-item.component";
import { NewBrewingComponent } from "./scheduled-brewing/new-brewing/new-brewing.component";

export let routes: Routes = [
    { path: 'inventory', component: InventoryComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
    { path: 'inventory/new', component: NewElementComponent, canActivate: [() => inject(LoginService).isLoggedIn()]},
    { path: 'inventory/:ingId', component: EditIngredientComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
    

    { path: 'recipes', component: RecipesComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
    { path: 'recipes/new', component: NewRecipeComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
    { path: 'recipes/:recipeId', component: EditRecipeComponent, canActivate: [() => inject(LoginService).isLoggedIn()]},

    { path: 'scheduled-brewing', component: ScheduledBrewingComponent, canActivate: [() => inject(LoginService).isLoggedIn()] },
    { path: 'scheduled-brewing/new', component: NewBrewingComponent, canActivate: [() => inject(LoginService).isLoggedIn()]}
];

@NgModule({
    declarations: [
        InventoryComponent,
        InventoryElement,
        FilterComponent,
        EditIngredientComponent,
        NewElementComponent,
        PaginationComponent,
        RecipesComponent,
        RecipeCardComponent,
        NewRecipeComponent,
        RecipeFormComponent,
        EditRecipeComponent,
        FirstCapDirective,
        ScheduledBrewingComponent,
        ScheduledItemComponent,
        NewBrewingComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        HttpClientModule,
        ReactiveFormsModule,
        MatSortModule
    ],
    providers: []
})
export class BrewingModule {

}