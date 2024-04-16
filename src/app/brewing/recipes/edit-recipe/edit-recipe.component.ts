import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Recipe } from "../interfaces/recipe.interface";
import { RecipeService } from "../services/recipe.service";

@Component({
  selector: 'edit-recipe',
  templateUrl: 'edit-recipe.component.html',
  styleUrls: ['edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  recipe$?: Observable<Recipe>;

  /**
   * Initializes the component by fetching the recipe with the specified ID.
   */
  ngOnInit(): void {
    let recipeId: string = this.route.snapshot.params['recipeId'];
    this.recipe$ = this.recipeService.getRecipeById(recipeId);
  }

  /**
   * Sends a request to edit the specified recipe.
   * @param recipe - The recipe to be edited.
   */
  public editRecipe(recipe: Recipe): void {
    this.recipeService.editRecipe(recipe).subscribe({
      next: () => this.router.navigateByUrl("/recipes"),
      error: (er) => alert(er.message)
    });
  }
}
