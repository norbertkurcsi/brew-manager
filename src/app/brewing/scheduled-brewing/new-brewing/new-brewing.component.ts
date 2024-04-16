import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, take } from "rxjs";
import { Recipe } from "../../recipes/interfaces/recipe.interface";
import { RecipeService } from "../../recipes/services/recipe.service";
import { ScheduledBrew } from "../interfaces/schedules-brews.interface";
import { ScheduledBrewService } from "../services/scheduled-brew.service";

/**
 * Component for creating a new brewing schedule.
 */
@Component({
  selector: 'new-brewing',
  templateUrl: 'new-brewing.component.html',
  styleUrls: ['new-brewing.component.css']
})
export class NewBrewingComponent implements OnInit {
  constructor(
    private recipeService : RecipeService,
    private brewService: ScheduledBrewService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  /** Observable of recipes. */
  recipes$?: Observable<Recipe[]>;

  /** Indicates whether to show error messages. */
  showError = false;

  /** Indicates whether there are not enough ingredients for brewing. */
  notEnoughIngredients = false;

  /** Form group for the new brewing schedule form. */
  form = this.fb.group({
    recipe: ['0',this.selectValueValidator()],
    date: ['', [Validators.required, this.dateGreaterOrEqualThanTodayValidator()]]
  });

  /** Initializes the component. */
  ngOnInit(): void {
    this.recipes$ = this.recipeService.getRecipes().pipe(take(1));
  }

  /**
   * Custom validator for checking if a select input has a default value.
   * @returns A validation error if the select input has a default value, otherwise null.
   */
  private selectValueValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      return (control.value == 0) ? { forbiddenValue: { value: control.value } } : null;
    }
  }

  /**
   * Custom validator for checking if the selected date is greater than or equal to today's date.
   * @returns A validation error if the selected date is not greater than or equal to today's date, otherwise null.
   */
  private dateGreaterOrEqualThanTodayValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0,0,0,0);
      const isValid = inputDate >= today;
      return isValid ? null : {'dateGreaterOrEqualThanToday': {value: control.value}};
    }
  }

  /**
   * Handles successful addition of a brewing schedule.
   * @param ingredientUnderThreshold Indicates if one or more ingredients are under threshold.
   */
  private handleSuccesfullAdd(ingredientUnderThreshold : boolean): void {
    if (ingredientUnderThreshold)
      alert("One or more ingredients are under threshold!");
    this.navigateBackToBrewingList();
  }

  /**
   * Handles errors that occur during the addition of a brewing schedule.
   * @param err The error object.
   */
  private handleErrorAtAdding(err: Error): void {
    if (err.cause === 50) {
      this.notEnoughIngredients = true;
    }
    alert(err.message);
  }

  /** Submits the form to add a new brewing schedule. */
  public submitForm(): void {
    this.showError = true;
    this.notEnoughIngredients = false;
    if (this.form.valid) {
      let recipe = this.form.value.recipe || "";
      let date = Date.parse(this.form.value.date || "");
      let brew: ScheduledBrew = {
        id: "0",
        recipe: recipe,
        date: date
      }
      this.brewService.addScheduledBrew(brew).subscribe({
        next: val => this.handleSuccesfullAdd(val),
        error: err => this.handleErrorAtAdding(err)
      });
    }
  }

  /** Navigates back to the brewing schedule list page. */
  public navigateBackToBrewingList(): void {
    this.router.navigateByUrl("/scheduled-brewing");
  }
}
