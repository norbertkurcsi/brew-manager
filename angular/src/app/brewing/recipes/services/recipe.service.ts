import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {
  combineLatestWith,
  concatMap,
  exhaustMap,
  interval,
  map,
  merge,
  Observable,
  of,
  Subject,
  take,
  tap
} from "rxjs";
import {IngredientService} from "../../inventory/ingredient/ingredient.service";
import {Recipe} from "../interfaces/recipe.interface";
import {ScheduledBrew} from "../../scheduled-brewing/interfaces/schedules-brews.interface";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(
    private ingredientService: IngredientService,
    private http: HttpClient
  ) {
  }

  /**
   * Subject for triggering events to refresh recipe data.
   */
  private deleteEvent$ = new Subject<boolean>();

  /**
   * Retrieves recipes with resolved ingredients' names.
   */
  public getRecipes(): Observable<Recipe[]> {
    let merged$ = merge(of(1), interval(3000), this.deleteEvent$);

    return merged$
      .pipe(
        exhaustMap(() => this.http.get<Recipe[]>("https://brewmanager-backend.azurewebsites.net/recipes")),
        combineLatestWith(this.ingredientService.getIngredients().pipe(take(1))),
        map(([recipes, ingredients]) => {
          recipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
              ingredient.name = ingredients.find(ing => ing.id == ingredient.id)?.name;
            });
          });
          return recipes;
        })
      );
  }

  /**
   * Deletes a recipe and triggers an event to refresh data.
   * @param recipe The recipe to be deleted.
   * @returns An observable indicating the success of the delete operation.
   */
  public deleteRecipe(recipe: Recipe | undefined) {
    return this.http.get<ScheduledBrew[]>(`https://brewmanager-backend.azurewebsites.net/scheduled-brews`).pipe(
      tap(brews => {
        brews.forEach(brew => {
          if (brew.recipe === recipe?.id) {
            throw new Error("Nem lehet törölni");
          }
        })
      }),
      concatMap(() => this.http.delete<Recipe>(`https://brewmanager-backend.azurewebsites.net/recipes/${recipe?.id}`)),
      tap(() => this.deleteEvent$.next(true))
    )
  }

  /**
   * Retrieves a recipe by its ID with resolved ingredients' names.
   * @param id The ID of the recipe to retrieve.
   * @returns An observable of the recipe with resolved ingredients' names.
   */
  public getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`https://brewmanager-backend.azurewebsites.net/recipes/${id}`).pipe(
      combineLatestWith(this.ingredientService.getIngredients().pipe(take(1))),
      map(([recipe, ingredients]) => {
        recipe.ingredients.forEach(ingredient => {
          ingredient.name = ingredients.find(ing => ing.id == ingredient.id)?.name;
        });
        return recipe;
      })
    );
  }

  /**
   * Retrieves recipes without resolving ingredients' names.
   * @returns An observable of the raw recipes.
   */
  public getRecipesRaw(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`https://brewmanager-backend.azurewebsites.net/recipes`);
  }

  /**
   * Retrieves a recipe by its ID without resolving ingredients' names.
   * @param id The ID of the recipe to retrieve.
   * @returns An observable of the raw recipe.
   */
  public getRecipeRawById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`https://brewmanager-backend.azurewebsites.net/recipes/${id}`);
  }

  /**
   * Updates a recipe.
   * @param recipe The recipe to update.
   * @returns An observable indicating the success of the update operation.
   */
  public editRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`https://brewmanager-backend.azurewebsites.net/recipes/${recipe.id}`, recipe);
  }

  /**
   * Adds a new recipe.
   * @param recipe The recipe to add.
   * @returns An observable of the added recipe.
   */
  public addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`https://brewmanager-backend.azurewebsites.net/recipes`, recipe);
  }
}
