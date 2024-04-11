import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Recipe } from "./interfaces/recipe.interface";
import { RecipeService } from "./services/recipe.service";

@Component({
    selector: 'recipes',
    templateUrl: 'recipes.component.html',
    styleUrls: ['recipes.component.css']
})
export class RecipesComponent implements OnInit{
    constructor(
        private recipeService: RecipeService,
        private router: Router
    ) { }
    
    recipes$?: Observable<Recipe[]>;

    ngOnInit(): void {
        this.recipes$ = this.recipeService.getRecipes();
    }

    public navigateToNewRecipe() {
        this.router.navigateByUrl("/recipes/new");
    }
    
}