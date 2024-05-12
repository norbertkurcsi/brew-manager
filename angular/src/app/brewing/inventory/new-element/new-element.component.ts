import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
    threshold: new FormControl('', [Validators.required, Validators.min(0)])
  });

  /**
   * Navigates back to the inventory page.
   */
  public navigateBackToInventory(): void {
    this.router.navigateByUrl("/inventory");
  }

  /**
   * Handles errors that occur during the addition of a new item.
   */
  private handleError(): void {
    alert("Hiba történt a hozzáadásnál. Próbálja újra");
  }

  /**
   * Adds a new item to the inventory.
   * If the form is valid, creates a new Ingredient object and sends it to the server.
   * Navigates back to the inventory page on success, or shows an error alert on failure.
   */
  public addItem(): void {
    if (this.form.valid) {
      let formName = this.form.value.name || "";
      let formStock = Number(this.form.value.stock);
      let formThreshold = Number(this.form.value.threshold);

      let ingredient: Ingredient = {
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
