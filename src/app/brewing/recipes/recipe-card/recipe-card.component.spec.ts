import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RecipeCardComponent } from './recipe-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RecipeService } from '../services/recipe.service';
import { of, throwError } from 'rxjs';
import { Recipe } from '../interfaces/recipe.interface';


describe('RecipeCardComponent', () => {
    let component: RecipeCardComponent;
    let fixture: ComponentFixture<RecipeCardComponent>;
    let recipeService: jasmine.SpyObj<RecipeService>;

    beforeEach(async () => {
        recipeService = jasmine.createSpyObj('RecipeService', ['deleteRecipe']);
        await TestBed.configureTestingModule({
            declarations: [ RecipeCardComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: RecipeService, useValue: recipeService }
            ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecipeCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render recipe data correctly', () => {
        component.recipe = {
            id: "1",
            name: 'Test Recipe',
            ingredients: [
                {id: "1", name: 'Ingredient 1', amount: 1 },
                {id: "1", name: 'Ingredient 2', amount: 2 }
            ]
        };
        fixture.detectChanges();

        const recipeName = fixture.debugElement.query(By.css('h3')).nativeElement.textContent;
        const recipeId = fixture.debugElement.query(By.css('#recipe-id')).nativeElement.textContent;
        const ingredients = fixture.debugElement.queryAll(By.css('.ing'));
        expect(recipeName).toBe('Test Recipe');
        expect(recipeId).toBe('ID: 1');
        expect(ingredients.length).toBe(2);
        expect(ingredients[0].nativeElement.textContent).toBe('Ingredient 1 1.00');
        expect(ingredients[1].nativeElement.textContent).toBe('Ingredient 2 2.00');
    });

    it('should call deleteRecipe method when delete button is clicked', () => {
        component.recipe = { id: "1", name: 'Test Recipe', ingredients: [] };
        fixture.detectChanges();

        recipeService.deleteRecipe.and.returnValue(of(component.recipe));
        const deleteButton = fixture.debugElement.query(By.css('#delete')).nativeElement;
        deleteButton.click();

        expect(recipeService.deleteRecipe).toHaveBeenCalledWith(component.recipe);
    });

    it('should navigate to edit recipe page when edit button is clicked', () => {
        component.recipe = { id: "1", name: 'Test Recipe', ingredients: [] };
        fixture.detectChanges();

        const navigateSpy = spyOn(component['router'], 'navigateByUrl');
        const editButton = fixture.debugElement.query(By.css('#edit')).nativeElement;
        editButton.click();

        expect(navigateSpy).toHaveBeenCalledWith(`recipes/${component.recipe.id}`);
    });

    it('should handle error when delete method fails', fakeAsync(() => {
        const mockError = new Error('Delete failed');
        spyOn(window, 'alert');
        recipeService.deleteRecipe.and.returnValue(
            throwError(() => mockError)
        );

        const deleteButton = fixture.debugElement.query(By.css('#delete')).nativeElement;
        deleteButton.click();

        tick();

        expect(window.alert).toHaveBeenCalledWith("Delete operation failed! Try again!");
    }));

});
