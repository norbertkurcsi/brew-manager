import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Recipe } from "../interfaces/recipe.interface";
import { RecipeService } from "../services/recipe.service";

@Component({
    selector: 'new-recipe',
    templateUrl: 'new-recipe.component.html',
    styleUrls: ['new-recipe.component.css']
})
export class NewRecipeComponent {
    constructor(
        private recipeService: RecipeService,
        private router : Router
    ){}

    public addNewRecipe(recipe : Recipe) {
        this.recipeService.addRecipe(recipe).subscribe({
            next: () => this.router.navigateByUrl("/recipes"),
            error: (er) => alert(er.message)
        });
    }
}