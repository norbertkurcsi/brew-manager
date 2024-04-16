import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeService } from '../services/recipe.service';
import { EditRecipeComponent } from './edit-recipe.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

describe('EditRecipeComponent', () => {
    let component: EditRecipeComponent;
    let fixture: ComponentFixture<EditRecipeComponent>;
    let recipeService: jasmine.SpyObj<RecipeService>;
    let router: jasmine.SpyObj<Router>;
    let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

    beforeEach(async () => {
    const recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getRecipeById', 'editRecipe']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    activatedRouteSpy.snapshot = { params: { recipeId: 1 } };

    await TestBed.configureTestingModule({
        declarations: [EditRecipeComponent, MockComponent(RecipeFormComponent)],
        providers: [
            { provide: RecipeService, useValue: recipeServiceSpy },
            { provide: Router, useValue: routerSpy },
            { provide: ActivatedRoute, useValue: activatedRouteSpy }
        ]
    })
        .compileComponents();

    recipeService = TestBed.inject(RecipeService) as jasmine.SpyObj<RecipeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
});

    beforeEach(() => {
        fixture = TestBed.createComponent(EditRecipeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should get the recipe by id', () => {
            const recipeId = "1";
            const recipe: Recipe = { id: recipeId, name: 'Test Recipe', ingredients:[]};
            activatedRoute.snapshot.params = { recipeId: recipeId.toString() };
            recipeService.getRecipeById.and.returnValue(of(recipe));

            component.ngOnInit();

            expect(recipeService.getRecipeById).toHaveBeenCalledWith(String(recipeId));
        });
    });

    describe('editRecipe', () => {
        it('should edit the recipe and navigate to recipes', () => {
            const recipe: Recipe = { id: "1", name: 'Test Recipe', ingredients:[]};
            recipeService.editRecipe.and.returnValue(of(recipe));

            component.editRecipe(recipe);

            expect(recipeService.editRecipe).toHaveBeenCalledWith(recipe);
            expect(router.navigateByUrl).toHaveBeenCalledWith('/recipes');
        });

        it('should handle errors', () => {
            const recipe: Recipe = { id: "1", name: 'Test Recipe', ingredients:[] };
            const error = new Error('Test error');
            recipeService.editRecipe.and.returnValue(throwError(() => error));
            spyOn(window, 'alert');

            component.editRecipe(recipe);

            expect(recipeService.editRecipe).toHaveBeenCalledWith(recipe);
            expect(router.navigateByUrl).not.toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith(error.message);
        });
    });

    describe('template', () => {
        it('should display the recipe form', () => {
            const recipe: Recipe = { id: "1", name: 'Test Recipe', ingredients: [] };
            component.recipe$ = of(recipe);
            fixture.detectChanges();

            const recipeFormElement = fixture.debugElement.query(By.directive(RecipeFormComponent));
            expect(recipeFormElement).toBeTruthy();
        });
    });

});
