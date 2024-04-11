import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Ingredient } from "../ingredient/ingredient.interface";
import { IngredientService } from "../ingredient/ingredient.service";

@Component({
    selector: 'tr[inventory-element]',
    templateUrl: 'inventory-element.component.html',
    styleUrls: ['inventory-element.component.css']
})
export class InventoryElement {
    @Input() ingredient?: Ingredient;

    constructor(
        private ingredientService: IngredientService,
        private router:Router
    ) { }

    private showAlert(error: Error) {
        alert(error.message);
    }

    public deleteIngredient() {
        this.ingredientService.deleteIngredient(this.ingredient).subscribe({
            error: (er) => this.showAlert(er)
        })
    }

    public navigateToEditPage() {
        this.router.navigateByUrl(`/inventory/${this.ingredient?.id}`);
    }
}