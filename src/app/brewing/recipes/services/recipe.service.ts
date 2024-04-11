import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { combineLatestWith, exhaustAll, exhaustMap, interval, map, merge, of, Subject, take, tap } from "rxjs";
import { IngredientService } from "../../inventory/ingredient/ingredient.service";
import { RecipeIngredient } from "../interfaces/recipe-ingredient.interface";
import { Recipe } from "../interfaces/recipe.interface";

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    constructor(
        private ingredientService: IngredientService,
        private  http: HttpClient
    ) { }

    private deleteEvent$ = new Subject<boolean>();

    public getRecipes() {
        let merged$ = merge(of(1),interval(3000), this.deleteEvent$)

        return merged$
            .pipe(
                exhaustMap(() => this.http.get<Recipe[]>("http://localhost:3000/recipes")),
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

    public deleteRecipe(recipe: Recipe | undefined) {
        return this.http.delete<Recipe>(`http://localhost:3000/recipes/${recipe?.id}`)
            .pipe(tap(() => this.deleteEvent$.next(true)));
    }

    public getRecipeById(id: string) {
        return this.http.get<Recipe>(`http://localhost:3000/recipes/${id}`).pipe(
            combineLatestWith(this.ingredientService.getIngredients().pipe(take(1))),
            map(([recipe, ingredients]) => {
                recipe.ingredients.forEach(ingredient => {
                    ingredient.name = ingredients.find(ing => ing.id == ingredient.id)?.name;
                });
                return recipe;
            })
        );
    }

    public getRecipesRaw() {
        return this.http.get<Recipe[]>(`http://localhost:3000/recipes`);
    }

    public getRecipeRawById(id: string) {
        return this.http.get<Recipe>(`http://localhost:3000/recipes/${id}`);
    }

    public editRecipe(recipe : Recipe) {
        return this.http.put<Recipe>(`http://localhost:3000/recipes/${recipe.id}`, recipe);
    }

    public addRecipe(recipe: Recipe) {
        return this.http.post<Recipe>(`http://localhost:3000/recipes`, recipe);
    }
}