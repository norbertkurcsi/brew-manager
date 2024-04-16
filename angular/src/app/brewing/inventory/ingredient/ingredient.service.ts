import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { concatMap, exhaustMap, interval, merge, Observable, of, tap } from "rxjs";
import { Recipe } from "../../recipes/interfaces/recipe.interface";
import { Ingredient } from "./ingredient.interface";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  constructor(private http: HttpClient) { }

  private HOST: string = "http://localhost:3000";
  private deleteEvent = new Subject<boolean>();

  /**
   * Retrieves the list of ingredients from the server.
   * Automatically refreshes the list every 3 seconds or when a delete event occurs.
   * @returns An observable that emits an array of ingredients.
   */
  public getIngredients(): Observable<Ingredient[]> {
    let merged$ = merge(of(1), interval(3000), this.deleteEvent);

    return merged$.pipe(
      exhaustMap(() => this.http.get<Ingredient[]>(`${this.HOST}/inventory`))
    );
  }

  /**
   * Deletes the specified ingredient from the server.
   * Checks if the ingredient is used in any recipe before deletion.
   * @param ingredient The ingredient to delete.
   * @returns An observable indicating the success or failure of the deletion.
   */
  public deleteIngredient(ingredient: Ingredient | undefined): Observable<any> {
    return this.http.get<Recipe[]>(`${this.HOST}/recipes`).pipe(
      tap(recipes => {
        recipes.forEach(recipe => {
          if (recipe.ingredients.find(ing => ing.id === ingredient?.id)) {
            throw new Error("Nem lehet törölni"); // Cannot delete error
          }
        })
      }),
      concatMap(() => this.http.delete<Ingredient>(`${this.HOST}/inventory/${ingredient?.id}`)),
      tap(() => this.deleteEvent.next(true))
    );
  }

  /**
   * Retrieves the ingredient with the specified ID from the server.
   * @param id The ID of the ingredient to retrieve.
   * @returns An observable that emits the ingredient.
   */
  public getIngredientById(id: string): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.HOST}/inventory/${id}`);
  }

  /**
   * Updates the specified ingredient on the server.
   * @param ingredient The ingredient to update.
   * @returns An observable that emits the updated ingredient.
   */
  public editIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.patch<Ingredient>(`${this.HOST}/inventory/${ingredient.id}`, ingredient);
  }

  /**
   * Adds a new ingredient to the server.
   * @param ingredient The ingredient to add.
   * @returns An observable that emits the added ingredient.
   */
  public addItem(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.HOST}/inventory`, ingredient);
  }
}
