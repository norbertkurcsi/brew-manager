import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatestWith } from "rxjs";
import { map, Observable, take } from "rxjs";
import { Ingredient } from "../../inventory/ingredient/ingredient.interface";
import { IngredientService } from "../../inventory/ingredient/ingredient.service";
import { RecipeIngredient } from "../interfaces/recipe-ingredient.interface";
import { Recipe } from "../interfaces/recipe.interface";

/**
 * Component for displaying and managing a recipe form.
 */
@Component({
  selector: 'recipe-form',
  templateUrl: 'recipe-form.component.html',
  styleUrls: ['recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService,
    private router: Router
  ) { }

  /** Input property for the recipe data to edit. */
  @Input() recipe?: Recipe;

  /** Output event emitter for submitting the form data. */
  @Output() submitEmitter = new EventEmitter<Recipe>();

  /** Observable of selected ingredient IDs. */
  selectedIngredients$?: Observable<string[]>;

  /** Observable of filtered ingredients based on selected ones. */
  filteredIngredients$?: Observable<Ingredient[]>;

  /** Subject to trigger ingredient change events. */
  ingredientsChange$ = new BehaviorSubject(true);

  /** Form group for the recipe form. */
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern(/^[^%!<>()]*$/)]],
    ingredients: this.fb.array([])
  });

  /** Getter for accessing the ingredients form array. */
  get ingredients() {
    return this.form.controls["ingredients"] as FormArray;
  }

  /** Indicates whether to show error messages. */
  showError = false;

  /** Default option for ingredient selection. */
  public defaultVal = { id: 0, name: "select an option" }

  /**
   * Initializes the recipe form with data if a recipe is provided.
   */
  private initRecipe(): void {
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
        return ingredients.filter(ingredient => !selectedIngredients.includes(ingredient.id!));
      }),
    );

    this.initRecipe();
  }

  /**
   * Custom validator for ingredient selection.
   * @returns A validation error if the selected ingredient is the default option, null otherwise.
   */
  private selectValueValidator(): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value.id === 0) ? { forbiddenValue: { value: control.value } } : null;
    }
  }

  /**
   * Retrieves the selected value for a specific ingredient.
   * @param index The index of the ingredient in the form array.
   * @returns The selected ingredient.
   */
  public getOwnSelectedValue(index: number): Ingredient {
    return this.ingredients.at(index).value.ingredient;
  }

  /** Triggers a change event when the ingredient selection changes. */
  public selectChanged(): void {
    this.ingredientsChange$.next(true);
  }

  /**
   * Adds a new ingredient to the form.
   * @param ingredientFormGroup The form group representing the new ingredient.
   */
  public addIngredient(ingredientFormGroup?: FormGroup): void {
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

  /**
   * Deletes an ingredient from the form.
   * @param ingredientIndex The index of the ingredient to delete.
   */
  public deleteIngredient(ingredientIndex: number): void {
    this.ingredients.removeAt(ingredientIndex);
    this.ingredientsChange$.next(true);
  }

  /** Cancels the current operation and navigates back to the recipes page. */
  public cancelOperation(): void {
    this.router.navigateByUrl("/recipes");
  }

  /**
   * Creates a recipe object from the form values.
   * @returns The created recipe object.
   */
  private createRecipeFromFormValues(): Recipe {
    let name = this.form.value.name || "";
    let recipe: Recipe = {
      id: this.recipe?.id,
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

  /** Submits the form values and emits the recipe object. */
  public submitForm(): void {
    this.showError = true;
    if (!this.form.valid) return;
    this.submitEmitter.emit(this.createRecipeFromFormValues());
  }
}
