import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Recipe } from './interfaces/recipe.interface';
import { RecipeService } from './services/recipe.service';
import { RecipesComponent } from './recipes.component';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { By } from '@angular/platform-browser';


describe('RecipesComponent', () => {
    let component: RecipesComponent;
    let fixture: ComponentFixture<RecipesComponent>;
    let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const recipes: Recipe[] = [
        { id: "1", name: 'Recipe 1', ingredients: [] },
        { id: "2", name: 'Recipe 2', ingredients: [] },
        ];

    beforeEach(async () => {
        recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getRecipes']);
        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        recipeServiceSpy.getRecipes.and.returnValue(of(recipes));

        await TestBed.configureTestingModule({
        declarations: [RecipesComponent, RecipeCardComponent],
        providers: [
            { provide: RecipeService, useValue: recipeServiceSpy },
            { provide: Router, useValue: routerSpy },
        ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecipesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call navigateByUrl method when navigateToNewRecipe is called', () => {
        component.navigateToNewRecipe();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/recipes/new');
    });

    it('should display recipe cards with the correct recipe', fakeAsync(() => {

        tick();

        const recipeCardComponents = fixture.debugElement.queryAll(By.directive(RecipeCardComponent));
        expect(recipeCardComponents.length).toBe(2);

        for (let i = 0; i < recipeCardComponents.length; i++) {
            const recipeCardComponent = recipeCardComponents[i].componentInstance;
            expect(recipeCardComponent.recipe).toBe(recipes[i]);
        }
        }));
});
