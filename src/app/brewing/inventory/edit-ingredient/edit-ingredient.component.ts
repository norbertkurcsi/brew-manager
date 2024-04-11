import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Ingredient } from "../ingredient/ingredient.interface";
import { IngredientService } from "../ingredient/ingredient.service";

@Component({
    selector: 'edit-ingredient',
    templateUrl: 'edit-ingredient.component.html',
    styleUrls: ['edit-ingredient.component.css']
})
export class EditIngredientComponent implements OnInit{
    constructor(
        private route: ActivatedRoute,
        private ingredientService: IngredientService,
        private router : Router
    ) { }

    ingredient?: Ingredient;

    form = new FormGroup({
        stock: new FormControl('', [Validators.required, Validators.min(0)])
    });

    ngOnInit(): void {
        let ingID : string = this.route.snapshot.params['ingId'];
        this.ingredientService.getIngredientById(ingID).subscribe((ingredient) => {
            this.ingredient = ingredient;
            if (this.ingredient) this.form.get('stock')?.setValue(String(ingredient.stock));
        });
    }

    public submitChange() {
        if (this.form.valid && this.ingredient) {
            this.ingredient.stock = Number(this.form.value.stock);
            this.ingredientService.editIngredient(this.ingredient).subscribe({
                next: () => this.navigateBack(),
                error: () => alert("The edit request was unsuccesfull")
            })
            
        }
    }

    public navigateBack() {
        this.router.navigateByUrl("/inventory");
    }
}