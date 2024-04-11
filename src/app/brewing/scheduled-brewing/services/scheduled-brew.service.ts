import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { BehaviorSubject, concatAll, concatMap, exhaustMap, from, last, pipe, take, takeLast, tap } from "rxjs";
import { combineLatestWith, map, Observable } from "rxjs";
import { IngredientService } from "../../inventory/ingredient/ingredient.service";
import { RecipeService } from "../../recipes/services/recipe.service";
import { ScheduledBrew } from "../interfaces/schedules-brews.interface";

@Injectable({
    providedIn: 'root'
})
export class ScheduledBrewService {
    constructor(
        private ingredientService: IngredientService,
        private recipeService: RecipeService,
        private http: HttpClient
    ) { }

    private deleteEvent = new BehaviorSubject(true);

    public getBrewings() : Observable<ScheduledBrew[]> {
        return this.deleteEvent.pipe(
            exhaustMap(() => this.http.get<ScheduledBrew[]>('http://localhost:3000/scheduled-brews')),
            combineLatestWith(this.recipeService.getRecipesRaw()),
            map(([brewings, recipes]) => {
                brewings.forEach(brewing => {
                    brewing.recipeName = recipes.find(recipe => recipe.id === brewing.recipe)?.name;
                });
                return brewings;
            })
        );
    }

    public sortBrewings(brewings: ScheduledBrew[], sort: Sort) {
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

    public deleteScheduledBrew(brew: ScheduledBrew) {
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
            concatMap(() => this.http.delete<ScheduledBrew>(`http://localhost:3000/scheduled-brews/${brew.id}`)),
            tap(() => this.deleteEvent.next(true))
        );
    }

    public addScheduledBrew(brew: ScheduledBrew) {
        let alert = false;
        let patchRequests$ =  this.recipeService.getRecipeRawById(String(brew.recipe)).pipe(
            combineLatestWith(this.ingredientService.getIngredients().pipe(take(1))),
            map(([recipe, inventory]) => {
                console.log(recipe)
                console.log(inventory)
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
            concatMap(() => this.http.post<ScheduledBrew>(`http://localhost:3000/scheduled-brews`, brew)),
            map(() => alert)
        );
    }
}
