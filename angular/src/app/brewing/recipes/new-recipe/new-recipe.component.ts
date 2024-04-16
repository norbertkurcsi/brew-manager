import { Component } from "@angular/core";
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
    private router: Router
  ) {}

  /**
   * Adds a new recipe by sending a request to the RecipeService.
   * Navigates to the recipes page after successfully adding the recipe.
   * Displays an error alert if adding the recipe fails.
   * @param recipe - The new recipe to be added.
   */
  public addNewRecipe(recipe: Recipe): void {
    this.recipeService.addRecipe(recipe).subscribe({
      next: () => this.router.navigateByUrl("/recipes"),
      error: (er) => alert(er.message)
    });
  }
}
