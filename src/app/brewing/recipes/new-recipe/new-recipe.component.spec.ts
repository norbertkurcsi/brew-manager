import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeService } from '../services/recipe.service';
import { NewRecipeComponent } from './new-recipe.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { HttpClientModule } from '@angular/common/http';
import { MockComponent, MockedComponent, ngMocks } from 'ng-mocks';

describe('NewRecipeComponent', () => {
    let component: NewRecipeComponent;
    let fixture: ComponentFixture<NewRecipeComponent>;
    let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let recipeFormComponent: MockedComponent<RecipeFormComponent>;

    beforeEach(async () => {
        recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['addRecipe']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [ NewRecipeComponent, MockComponent(RecipeFormComponent) ],
            providers: [
                { provide: RecipeService, useValue: recipeServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NewRecipeComponent);
        component = fixture.componentInstance;
        recipeFormComponent = ngMocks.find(RecipeFormComponent).componentInstance as MockedComponent<RecipeFormComponent>;
        fixture.detectChanges();
    });

    it('should render the recipe-form component', () => {
        expect(ngMocks.find(RecipeFormComponent)).not.toBeNull();
    });

    it('should navigate to /recipes on successful recipe addition', () => {
        const recipe: Recipe = { id: 1, name: 'Test Recipe', ingredients: [] };
        recipeServiceSpy.addRecipe.and.returnValue(of(recipe));
        recipeFormComponent.submitEmitter.emit(recipe);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/recipes');
    });

    it('should display an alert on error', () => {
        const recipe: Recipe = { id: 1, name: 'Test Recipe', ingredients: [] };
        recipeServiceSpy.addRecipe.and.returnValue(throwError({ message: 'Error adding recipe' }));
        spyOn(window, 'alert');
        recipeFormComponent.submitEmitter.emit(recipe);
        expect(window.alert).toHaveBeenCalledWith('Error adding recipe');
    });
});
