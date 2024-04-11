import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NewElementComponent } from "./new-element.component"
import { Router } from "@angular/router";
import { IngredientService } from "../ingredient/ingredient.service";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { Ingredient } from "../ingredient/ingredient.interface";
import { of, throwError } from "rxjs";

describe('NewElementComponent', () => {
    let component: NewElementComponent;
    let fixture: ComponentFixture<NewElementComponent>;
    let fakeRouter: Router;
    let fakeIngredientService: jasmine.SpyObj<IngredientService>;

    beforeEach(async () => {
        fakeRouter = jasmine.createSpyObj(['navigateByUrl']);
        fakeIngredientService = jasmine.createSpyObj('IngredientService', ['addItem']);

        await TestBed.configureTestingModule({
            declarations: [NewElementComponent],
            imports: [RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: Router, useValue: fakeRouter },
                { provide: IngredientService, useValue: fakeIngredientService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NewElementComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
    

    it('should display the error message if name input is focused and then click away', () => {
        const nameInput = fixture.nativeElement.querySelector('#name');
        let errorMessage = fixture.nativeElement.querySelector('#name + span span');
        
        expect(errorMessage).toBeNull();
        
        nameInput.dispatchEvent(new Event('focus'));
        fixture.detectChanges();
        
        nameInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        errorMessage = fixture.nativeElement.querySelector('#name + span span');
        
        expect(errorMessage.textContent.trim()).toBe('Name is required');
    });

    it('after deleting the name input it should display the error message', () => {
        const nameInput = fixture.nativeElement.querySelector('#name');
        let errorMessage = fixture.nativeElement.querySelector('#name + span span');
        
        expect(errorMessage).toBeNull();
        
        nameInput.dispatchEvent(new Event('focus'));
        fixture.detectChanges();
        
        nameInput.value = '';
        nameInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        
        errorMessage = fixture.nativeElement.querySelector('#name + span span');
        
        expect(errorMessage.textContent.trim()).toBe('Name is required');
    });

    it('should display the error message if stock input is focused and then click away', () => {
        const stockInput = fixture.nativeElement.querySelector('#stock');
        let errorMessage = fixture.nativeElement.querySelector('#stock + span span');
        
        expect(errorMessage).toBeNull();
        
        stockInput.dispatchEvent(new Event('focus'));
        fixture.detectChanges();
        
        stockInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        errorMessage = fixture.nativeElement.querySelector('#stock + span span');
        
        expect(errorMessage.textContent.trim()).toBe('Stock is required');
    });

    it('should display error message if stock is empty', () => {
        const stockInput = fixture.nativeElement.querySelector('#stock');
        let errorMessage = fixture.debugElement.query(By.css('span[data-testid="required-stock"]'));
        
        expect(errorMessage).toBeNull();
        
        stockInput.value = 1;
        stockInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        errorMessage = fixture.debugElement.query(By.css('span[data-testid="required-stock"]'));
        expect(errorMessage).toBeNull();
        
        stockInput.value = '';
        stockInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        errorMessage = fixture.debugElement.query(By.css('span[data-testid="required-stock"]'));
        expect(errorMessage).not.toBeNull();
        expect(errorMessage.nativeElement.textContent.trim()).toBe('Stock is required');
    });

    it('should display error message if threshold is empty', () => {
        const thresholdInput = fixture.nativeElement.querySelector('#threshold');
        let errorMessage = fixture.debugElement.query(By.css('span[data-testid="required-threshold"]'));
        
        expect(errorMessage).toBeNull();
        
        thresholdInput.value = 1;
        thresholdInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        errorMessage = fixture.debugElement.query(By.css('span[data-testid="required-threshold"]'));
        expect(errorMessage).toBeNull();
        
        thresholdInput.value = '';
        thresholdInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        errorMessage = fixture.debugElement.query(By.css('span[data-testid="required-threshold"]'));
        expect(errorMessage).not.toBeNull();
        expect(errorMessage.nativeElement.textContent.trim()).toBe('Threshold is required');
    });

    it('cancel button pressed, it should navigate back to inventory',() => {
        const cancelButton = fixture.nativeElement.querySelector('#cancel');
        cancelButton.click();
        fixture.detectChanges();

        expect(fakeRouter.navigateByUrl).toHaveBeenCalledWith('/inventory');
    });

    it('if form is filled in correctly it should add the ingredient to the inventory, and navigate to inventory', fakeAsync(() => {
        const expectedIngredient: Ingredient = {
            id: 0,
            name: 'Salt',
            stock: 10,
            threshold: 5
        };
        
        component.form.controls['name'].setValue('Salt');
        component.form.controls['stock'].setValue('10');
        component.form.controls['threshold'].setValue('5');
        fakeIngredientService.addItem.and.returnValue(of(expectedIngredient));
        fixture.detectChanges();
        tick();

        const addButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
        addButton.click();
        fixture.detectChanges();
        tick();

        

        expect(fakeIngredientService.addItem).toHaveBeenCalledWith(expectedIngredient);
        expect(fakeRouter.navigateByUrl).toHaveBeenCalledWith('/inventory');
    }));

    it('should alert message if adding the ingredient fails', fakeAsync(() => {
        const errorMessage = 'Failed to add ingredient.';
        fakeIngredientService.addItem.and.returnValue(throwError(errorMessage));
        spyOn(window, 'alert');

        component.form.controls['name'].setValue('Salt');
        component.form.controls['stock'].setValue('10');
        component.form.controls['threshold'].setValue('5');
        fixture.detectChanges();
        tick();

        const addButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
        addButton.click();
        fixture.detectChanges();
        tick();

        expect(window.alert).toHaveBeenCalledWith('Hiba történt a hozzáadásnál. Próbálja újra');
    }));

})