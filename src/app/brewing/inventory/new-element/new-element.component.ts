import { Component } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Ingredient } from "../ingredient/ingredient.interface";
import { IngredientService } from "../ingredient/ingredient.service";

@Component({
    selector: 'new-element',
    templateUrl: 'new-element.component.html',
    styleUrls: ['new-element.component.css']
})
export class NewElementComponent {
    constructor(
        private router: Router,
        private ingredientService : IngredientService
    ) { }

    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        stock: new FormControl('', [Validators.required, Validators.min(0)]),
        threshold: new FormControl('', [Validators.required,Validators.min(0)])
    });

    public navigateBackToInventory() {
        this.router.navigateByUrl("/inventory");
    }

    private handleError() {
        alert("Hiba történt a hozzáadásnál. Próbálja újra");
    }

    public addItem() {
        if (this.form.valid) {
            let formName = this.form.value.name || "";
            let formStock = Number(this.form.value.stock);
            let formThreshold = Number(this.form.value.threshold);

            let ingredient: Ingredient = {
                id: '0',
                name: formName,
                stock: formStock,
                threshold: formThreshold
            }

            this.ingredientService.addItem(ingredient).subscribe({
                next: () => this.navigateBackToInventory(),
                error: () => this.handleError()
            });
        }
    }
}
