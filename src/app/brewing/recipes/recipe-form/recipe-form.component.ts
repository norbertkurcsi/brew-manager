import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatestWith } from "rxjs";
import { map, Observable, take} from "rxjs";
import { Ingredient } from "../../inventory/ingredient/ingredient.interface";
import { IngredientService } from "../../inventory/ingredient/ingredient.service";
import { RecipeIngredient } from "../interfaces/recipe-ingredient.interface";
import { Recipe } from "../interfaces/recipe.interface";

@Component({
    selector: 'recipe-form',
    templateUrl: 'recipe-form.component.html',
    styleUrls: ['recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit{
    constructor(
        private fb: FormBuilder,
        private ingredientService: IngredientService,
        private router: Router
    ) { }

    @Input() recipe?: Recipe;
    @Output() submitEmitter = new EventEmitter<Recipe>();

    selectedIngredients$?: Observable<string[]>;
    filteredIngredients$?: Observable<Ingredient[]>;
    ingredientsChange$ = new BehaviorSubject(true);

    form = this.fb.group({
        name: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(20), Validators.pattern(/^[^%!<>()]*$/)]],
        ingredients: this.fb.array([])
    });

    get ingredients() {
        return this.form.controls["ingredients"] as FormArray;
    }

    showError = false;
    public defaultVal = { id: 0, name: "select an option" }

    private initRecipe() {
        if (!this.recipe) {
            return;
        }
        this.form.controls.name.patchValue(this.recipe.name);

        this.recipe.ingredients.forEach(ingredient => {
            const ingredientForm = this.fb.group({
                ingredient: [ingredient, this.selectValueValidator()],
                amount: [ingredient.amount, [Validators.required, Validators.min(1)]]
            });
            this.addIngredient(ingredientForm);
        });
    }

    ngOnInit(): void {
        this.selectedIngredients$ = this.ingredientsChange$.pipe(
            map(() => this.ingredients.controls.map((ingredient) => ingredient.value.ingredient.id)),
        );

        let ingredients$ = this.ingredientService.getIngredients().pipe(take(1));
        this.filteredIngredients$ = this.selectedIngredients$.pipe(
            combineLatestWith(ingredients$),
            map(([selectedIngredients, ingredients]) => {
                return ingredients.filter(ingredient => !selectedIngredients.includes(ingredient.id));
            }),
        );

        this.initRecipe();
    }

    private selectValueValidator() {
        return (control: AbstractControl): ValidationErrors | null => {
            return (control.value.id === 0) ? { forbiddenValue: { value: control.value } } : null;
        }
    }

    public getOwnSelectedValue(index: number): Ingredient {
        return this.ingredients.at(index).value.ingredient;
    }

    public selectChanged() {
        this.ingredientsChange$.next(true);
    }


    public addIngredient(ingredientFormGroup?: FormGroup) {
        if (ingredientFormGroup) {
            this.ingredients.push(ingredientFormGroup);
        } else {
            const ingredientForm = this.fb.group({
                ingredient: [this.defaultVal, this.selectValueValidator()],
                amount: ['1', [Validators.required, Validators.min(1)]]
            });
            this.ingredients.push(ingredientForm);
        }

        this.ingredientsChange$.next(true);
    }

    public deleteIngredient(ingredientIndex: number) {
        this.ingredients.removeAt(ingredientIndex);
        this.ingredientsChange$.next(true);
    }

    public cancelOperation() {
        this.router.navigateByUrl("/recipes");
    }

    private createRecipeFromFormValues() {
        let name = this.form.value.name || "";
        let recipe: Recipe = {
            id: this.recipe?.id || "0",
            name: name,
            ingredients: [] as RecipeIngredient[]
        }
        this.ingredients.controls.forEach(control => {
            const ingredient: RecipeIngredient = {
                id: String(control.value.ingredient.id),
                amount: Number(control.value.amount)
            }
            recipe.ingredients.push(ingredient);
        });
        return recipe;
    }

    public submitForm() {
        this.showError = true;
        if (!this.form.valid) return;
        this.submitEmitter.emit(this.createRecipeFromFormValues());
    }
}
