import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Recipe } from "../interfaces/recipe.interface";
import { RecipeService } from "../services/recipe.service";

@Component({
    selector: 'recipe-card',
    templateUrl: 'recipe-card.component.html',
    styleUrls: ['recipe-card.component.css']
})
export class RecipeCardComponent {
    constructor(
        private recipeService: RecipeService,
        private router: Router
    ) { }
    @Input() recipe?: Recipe;

    public deleteRecipe() {
        this.recipeService.deleteRecipe(this.recipe).subscribe({
            error: () => alert("Delete operation failed! Try again!")
        });
    }

    public navigateToEditRecipe() {
        this.router.navigateByUrl(`recipes/${this.recipe?.id}`);
    }
}