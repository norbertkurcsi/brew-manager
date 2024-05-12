import { RecipeIngredient } from "./recipe-ingredient.interface";

export interface Recipe {
    id?: string;
    name: string;
    ingredients: RecipeIngredient[];
}
