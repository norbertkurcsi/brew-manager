import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, take } from "rxjs";
import { Recipe } from "../../recipes/interfaces/recipe.interface";
import { RecipeService } from "../../recipes/services/recipe.service";
import { ScheduledBrew } from "../interfaces/schedules-brews.interface";
import { ScheduledBrewService } from "../services/scheduled-brew.service";

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

    recipes$?: Observable<Recipe[]>;
    showError = false;
    notEnoughIngredients = false;

    form = this.fb.group({
        recipe: ['0',this.selectValueValidator()],
        date: ['', [Validators.required, this.dateGreaterOrEqualThanTodayValidator()]]
    });

    ngOnInit(): void {
        this.recipes$ = this.recipeService.getRecipes().pipe(take(1));
    }

    private selectValueValidator() {
        return (control: AbstractControl): ValidationErrors | null => {
            return (control.value == 0) ? { forbiddenValue: { value: control.value } } : null;
        }
    }

    private dateGreaterOrEqualThanTodayValidator() {
        return (control: AbstractControl): ValidationErrors | null => {
            const inputDate = new Date(control.value);
            const today = new Date();
            today.setHours(0,0,0,0);
            const isValid = inputDate >= today;
            return isValid ? null : {'dateGreaterOrEqualThanToday': {value: control.value}};
        }
    }

    private handleSuccesfullAdd(ingredientUnderThreshold : boolean) {
        if (ingredientUnderThreshold)
            alert("One or more ingredients are under threshold!");
        this.navigateBackToBrewingList();
    }

    private handleErrorAtAdding(err: Error) {
        if (err.cause === 50) {
            this.notEnoughIngredients = true;
        }
        alert(err.message);
    }

    public submitForm() {
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

    public navigateBackToBrewingList() {
        this.router.navigateByUrl("/scheduled-brewing");
    }
}
