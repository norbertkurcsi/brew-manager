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

  /**
   * Deletes the recipe associated with this card.
   * Displays an alert if the deletion operation fails.
   */
  public deleteRecipe(): void {
    this.recipeService.deleteRecipe(this.recipe).subscribe({
      error: () => alert("Delete operation failed! Try again!")
    });
  }

  /**
   * Navigates to the edit page for the recipe associated with this card.
   */
  public navigateToEditRecipe(): void {
    this.router.navigateByUrl(`recipes/${this.recipe?.id}`);
  }
}
