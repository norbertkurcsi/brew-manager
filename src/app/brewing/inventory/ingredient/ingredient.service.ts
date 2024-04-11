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

    public getIngredients(): Observable<Ingredient[]> {
        let merged$ = merge(of(1),interval(3000), this.deleteEvent);

        return merged$.pipe(
            exhaustMap(() => this.http.get<Ingredient[]>(`${this.HOST}/inventory`))
        );
    }

    public deleteIngredient(ingredient: Ingredient | undefined) {

        return this.http.get<Recipe[]>(`${this.HOST}/recipes`).pipe(
            tap(recipes => {
                recipes.forEach(recipe => {
                    if (recipe.ingredients.find(ing => ing.id === ingredient?.id)) {
                        throw new Error("Nem lehet torolni");
                    }
                })
            }),
            concatMap(() => this.http.delete<Ingredient>(`${this.HOST}/inventory/${ingredient?.id}`)),
            tap(() => this.deleteEvent.next(true))
        )
    }

    public getIngredientById(id: string) {
        return this.http.get<Ingredient>(`${this.HOST}/inventory/${id}`);
    }

    public editIngredient(ingredient: Ingredient) {
        return this.http.patch<Ingredient>(`${this.HOST}/inventory/${ingredient.id}`, ingredient);

    }

    public addItem(ingredient : Ingredient) {
        return this.http.post<Ingredient>(`${this.HOST}/inventory`, ingredient);
    }
}