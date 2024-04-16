import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Ingredient } from "../ingredient/ingredient.interface";
import { IngredientService } from "../ingredient/ingredient.service";

@Component({
  selector: 'edit-ingredient',
  templateUrl: 'edit-ingredient.component.html',
  styleUrls: ['edit-ingredient.component.css']
})
export class EditIngredientComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private ingredientService: IngredientService,
    private router : Router
  ) { }

  ingredient?: Ingredient;

  form = new FormGroup({
    stock: new FormControl('', [Validators.required, Validators.min(0)])
  });

  /**
   * Initializes the component.
   * Retrieves the ingredient to be edited based on the route parameter.
   * Sets up the form with the initial stock value.
   */
  ngOnInit(): void {
    let ingID : string = this.route.snapshot.params['ingId'];
    this.ingredientService.getIngredientById(ingID).subscribe((ingredient) => {
      this.ingredient = ingredient;
      if (this.ingredient) this.form.get('stock')?.setValue(String(ingredient.stock));
    });
  }

  /**
   * Submits the changes to the ingredient's stock.
   * If the form is valid and an ingredient is available, updates the stock value and navigates back to the inventory.
   * If the edit request fails, displays an alert message.
   */
  public submitChange(): void {
    if (this.form.valid && this.ingredient) {
      this.ingredient.stock = Number(this.form.value.stock);
      this.ingredientService.editIngredient(this.ingredient).subscribe({
        next: () => this.navigateBack(),
        error: () => alert("The edit request was unsuccessful")
      })

    }
  }

  /**
   * Navigates back to the inventory page.
   */
  public navigateBack(): void {
    this.router.navigateByUrl("/inventory");
  }
}
