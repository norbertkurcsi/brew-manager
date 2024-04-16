import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { EditIngredientComponent } from './edit-ingredient.component';
import { IngredientService } from '../ingredient/ingredient.service';
import { Ingredient } from '../ingredient/ingredient.interface';
import { By } from '@angular/platform-browser';

describe('EditIngredientComponent', () => {
    let component: EditIngredientComponent;
    let fixture: ComponentFixture<EditIngredientComponent>;
    let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const ingredient: Ingredient = {
            id: "1",
            name: 'Salt',
            stock: 10,
            threshold: 5
        };

    beforeEach(async () => {
        const ingredientService = jasmine.createSpyObj('IngredientService', ['getIngredientById', 'editIngredient']);
        routerSpy = jasmine.createSpyObj(['navigateByUrl']);

        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientTestingModule
            ],
            declarations: [EditIngredientComponent],
            providers: [
                { provide: IngredientService, useValue: ingredientService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            params: {
                                ingId: '1'
                            }
                        }
                    }
                },
                {provide: Router, useValue: routerSpy}
            ]
        })
            .compileComponents();

        ingredientServiceSpy = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
        ingredientServiceSpy.getIngredientById.and.returnValue(of(ingredient));

        fixture = TestBed.createComponent(EditIngredientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should get the ingredient correctlz from the query params', () => {
        expect(ingredientServiceSpy.getIngredientById).toHaveBeenCalledWith('1');
        expect(component.ingredient).toEqual(ingredient);
    });

    it('should render the ingredient values correctly in the DOM', () => {
        const idParagraph = fixture.nativeElement.querySelector('p:nth-of-type(1)');
        const nameParagraph = fixture.nativeElement.querySelector('p:nth-of-type(2)');
        const thresholdParagraph = fixture.nativeElement.querySelector('p:nth-of-type(3)');
        const stockInput = fixture.nativeElement.querySelector('#stock');

        expect(idParagraph.textContent).toContain('ID : 1');
        expect(nameParagraph.textContent).toContain('Name : Salt');
        expect(thresholdParagraph.textContent).toContain('Threshold : 5');
        expect(stockInput.value).toContain('10');
    });

    it('should show error message when stock input is empty', () => {
        const stockInput = fixture.nativeElement.querySelector('#stock');
        let errorMessage = fixture.debugElement.query(By.css('[data-testid="stock-required"]'));

        expect(errorMessage).toBeNull();

        stockInput.value = 1;
        stockInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        errorMessage = fixture.debugElement.query(By.css('[data-testid="stock-required"]'));
        expect(errorMessage).toBeNull();

        stockInput.value = '';
        stockInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        errorMessage = fixture.debugElement.query(By.css('[data-testid="stock-required"]'));
        expect(errorMessage).not.toBeNull();
        expect(errorMessage.nativeElement.textContent.trim()).toBe('*stock is required');

    });

    it('should update the ingredient stock and navigate back to inventory after submitting the form', fakeAsync(() => {
        const updatedIngredient: Ingredient = {
            id: "1",
            name: 'Salt',
            stock: 15,
            threshold: 5
        };

        ingredientServiceSpy.editIngredient.and.returnValue(of(updatedIngredient));

        const submitButton = fixture.debugElement.query(By.css('#submit')).nativeElement;
        submitButton.click();
        tick();
        fixture.detectChanges();

        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/inventory');
    }));

    it('should display alert if the edit fails', fakeAsync(() => {
        ingredientServiceSpy.editIngredient.and.returnValue(throwError(() => new Error('error')));
        spyOn(window, 'alert');

        const submitButton = fixture.debugElement.query(By.css('#submit')).nativeElement;
        submitButton.click();
        tick();
        fixture.detectChanges();

        expect(window.alert).toHaveBeenCalledWith('The edit request was unsuccesfull');
    }));

});

