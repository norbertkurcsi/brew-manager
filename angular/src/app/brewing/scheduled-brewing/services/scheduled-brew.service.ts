import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { BehaviorSubject, from, Observable } from "rxjs";
import { concatAll, concatMap, exhaustMap, last, map, take, tap } from "rxjs/operators";
import { combineLatestWith } from "rxjs";
import { IngredientService } from "../../inventory/ingredient/ingredient.service";
import { RecipeService } from "../../recipes/services/recipe.service";
import { ScheduledBrew } from "../interfaces/schedules-brews.interface";

/**
 * Service responsible for managing scheduled brews.
 */
@Injectable({
  providedIn: 'root'
})
export class ScheduledBrewService {
  constructor(
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
    private http: HttpClient
  ) { }

  /** Subject used to trigger events for deleting scheduled brews. */
  private deleteEvent = new BehaviorSubject(true);

  /**
   * Retrieves all scheduled brews.
   * @returns An observable of an array of scheduled brews.
   */
  public getBrewings(): Observable<ScheduledBrew[]> {
    return this.deleteEvent.pipe(
      exhaustMap(() => this.http.get<ScheduledBrew[]>('https://brewmanager-backend.azurewebsites.net/scheduled-brews')),
      combineLatestWith(this.recipeService.getRecipesRaw()),
      map(([brewings, recipes]) => {
        brewings.forEach(brewing => {
          brewing.recipeName = recipes.find(recipe => recipe.id === brewing.recipe)?.name;
        });
        return brewings;
      })
    );
  }

  /**
   * Sorts an array of scheduled brews based on the provided sorting options.
   * @param brewings Array of scheduled brews to be sorted.
   * @param sort Sorting options.
   * @returns Sorted array of scheduled brews.
   */
  public sortBrewings(brewings: ScheduledBrew[], sort: Sort): ScheduledBrew[] {
    if (!sort.active || sort.direction === '') {
      return brewings;
    }

    return brewings.sort((a, b) => {
      if (sort.direction == 'asc') {
        return a.date - b.date;
      } else {
        return b.date - a.date;
      }
    });
  }

  /**
   * Deletes a scheduled brew.
   * @param brew The scheduled brew to be deleted.
   * @returns An observable indicating the completion of the deletion process.
   */
  public deleteScheduledBrew(brew: ScheduledBrew): Observable<any> {
    let patchRequests$ =  this.recipeService.getRecipeRawById(String(brew.recipe)).pipe(
      map(recipe => {
        const patchRequests = recipe.ingredients.map(ingredient => {
          return this.ingredientService.getIngredientById(String(ingredient.id)).pipe(
            concatMap(ing => {
              ing.stock += ingredient.amount;
              return this.ingredientService.editIngredient(ing);
            })
          );
        });
        return from(patchRequests).pipe(concatAll());
      }),
      concatAll()
    );

    return patchRequests$.pipe(
      last(),
      concatMap(() => this.http.delete<ScheduledBrew>(`https://brewmanager-backend.azurewebsites.net/scheduled-brews/${brew.id}`)),
      tap(() => this.deleteEvent.next(true))
    );
  }

  /**
   * Adds a new scheduled brew.
   * @param brew The scheduled brew to be added.
   * @returns An observable indicating the completion of the addition process.
   */
  public addScheduledBrew(brew: ScheduledBrew): Observable<boolean> {
    let alert = false;
    let patchRequests$ =  this.recipeService.getRecipeRawById(String(brew.recipe)).pipe(
      combineLatestWith(this.ingredientService.getIngredients().pipe(take(1))),
      map(([recipe, inventory]) => {
        const patchRequests = recipe.ingredients.map(ingredient => {
          let inventoryItem = inventory.find(item => item.id === ingredient.id);
          if (!inventoryItem) throw new Error("Database inconsistencie! Can't add the brew!");
          inventoryItem.stock -= ingredient.amount;
          if (inventoryItem.stock < 0) throw new Error(`Not enough ingredient: ${inventoryItem.name}`, {cause: 50});
          if (inventoryItem.stock < inventoryItem.threshold) alert = true;
          return this.ingredientService.editIngredient(inventoryItem);
        });
        return from(patchRequests).pipe(concatAll());
      }),
      concatAll()
    );

    return patchRequests$.pipe(
      last(),
      concatMap(() => this.http.post<ScheduledBrew>(`https://brewmanager-backend.azurewebsites.net/scheduled-brews`, brew)),
      map(() => alert)
    );
  }
}
