import { Component, Input } from "@angular/core";
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
    private router: Router
  ) { }

  /**
   * Displays an alert with the error message.
   * @param error The error object.
   */
  private showAlert(error: Error): void {
    alert(error.message);
  }

  /**
   * Deletes the current ingredient.
   * Subscribes to the deleteIngredient method of the ingredient service.
   * Displays an alert if an error occurs during deletion.
   */
  public deleteIngredient(): void {
    this.ingredientService.deleteIngredient(this.ingredient).subscribe({
      error: (error) => this.showAlert(error)
    });
  }

  /**
   * Navigates to the edit page for the current ingredient.
   * Redirects to the route `/inventory/:id`, where `id` is the ID of the ingredient.
   */
  public navigateToEditPage(): void {
    this.router.navigateByUrl(`/inventory/${this.ingredient?.id}`);
  }
}
