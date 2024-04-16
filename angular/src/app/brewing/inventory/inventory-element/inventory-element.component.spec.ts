import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Ingredient } from '../ingredient/ingredient.interface';
import { IngredientService } from '../ingredient/ingredient.service';
import { InventoryElement } from './inventory-element.component';
import { of, throwError } from 'rxjs';

describe('InventoryElement', () => {
  let component: InventoryElement;
  let fixture: ComponentFixture<InventoryElement>;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;

  beforeEach(() => {
        const spy = jasmine.createSpyObj('IngredientService', ['deleteIngredient']);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [InventoryElement],
            providers: [{ provide: IngredientService, useValue: spy }]
        });
        fixture = TestBed.createComponent(InventoryElement);
        component = fixture.componentInstance;
        ingredientServiceSpy = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
    });

    it('should render the ingredient data', () => {
        const ingredient: Ingredient = { id: "1", name: 'Sugar', stock: 3.14159, threshold: 2 };
        component.ingredient = ingredient;
        fixture.detectChanges();
        const cells = fixture.nativeElement.querySelectorAll('td');
        expect(cells.length).toBe(4);
        expect(cells[0].textContent).toBe(String(ingredient.id));
        expect(cells[1].textContent).toBe(ingredient.name);
        expect(cells[2].textContent).toBe(ingredient.stock.toFixed(2));
    });

    it('should call deleteIngredient when delete button is clicked', () => {
        const ingredient: Ingredient = { id: "1", name: 'Sugar', stock: 3.14159, threshold: 2 };
        component.ingredient = ingredient;
        fixture.detectChanges();

        ingredientServiceSpy.deleteIngredient.and.returnValue(
            of()
        );

        const deleteButton = fixture.nativeElement.querySelector('#delete');
        deleteButton.dispatchEvent(new Event('click'));
        expect(ingredientServiceSpy.deleteIngredient).toHaveBeenCalledWith(ingredient);
    });

    it('should call deleteIngredient when delete button is clicked', fakeAsync(() => {
        const ingredient: Ingredient = { id: "1", name: 'Sugar', stock: 3.14159, threshold: 2 };
        component.ingredient = ingredient;
        fixture.detectChanges();
        const deleteButton = fixture.nativeElement.querySelector('#delete');
        spyOn(window, 'alert');

        ingredientServiceSpy.deleteIngredient.and.returnValue(
            throwError(() => new Error('Delete ingredient failed'))
        );

        deleteButton.dispatchEvent(new Event('click'));
        tick();
        fixture.detectChanges();

        expect(window.alert).toHaveBeenCalledWith('Delete ingredient failed');
    }));



    it('should navigate to the edit page when edit button is clicked', () => {
        const ingredient: Ingredient = { id: "1", name: 'Sugar', stock: 3.14159, threshold: 2 };
        component.ingredient = ingredient;
        fixture.detectChanges();
        const editButton = fixture.nativeElement.querySelector('#edit');
        spyOn(component['router'], 'navigateByUrl');
        editButton.dispatchEvent(new Event('click'));
        expect(component['router'].navigateByUrl).toHaveBeenCalledWith(`/inventory/${ingredient.id}`);
    });
});
