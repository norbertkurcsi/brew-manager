import { Component, OnInit } from "@angular/core";
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

  /**
   * Initializes the component by fetching recipes from the service.
   */
  ngOnInit(): void {
    this.recipes$ = this.recipeService.getRecipes();
  }

  /**
   * Navigates to the page for creating a new recipe.
   */
  public navigateToNewRecipe(): void {
    this.router.navigateByUrl("/recipes/new");
  }

}
