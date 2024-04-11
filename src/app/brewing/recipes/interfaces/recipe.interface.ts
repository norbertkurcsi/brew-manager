import { RecipeIngredient } from "./recipe-ingredient.interface";

export interface Recipe {
    id: number;
    name: string;
    ingredients: RecipeIngredient[];
}