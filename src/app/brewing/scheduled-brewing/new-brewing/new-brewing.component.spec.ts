import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewBrewingComponent } from './new-brewing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeService } from '../../recipes/services/recipe.service';
import { of } from 'rxjs';
import { ScheduledBrewService } from '../services/scheduled-brew.service';
import { ScheduledBrew } from '../interfaces/schedules-brews.interface';
import { Recipe } from '../../recipes/interfaces/recipe.interface';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('NewBrewingComponent', () => {
    let component: NewBrewingComponent;
    let fixture: ComponentFixture<NewBrewingComponent>;
    let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
    let brewServiceSpy: jasmine.SpyObj<ScheduledBrewService>;
    let routerSpy: jasmine.SpyObj<ScheduledBrewService>;

    beforeEach(async () => {
        const recipeSpy = jasmine.createSpyObj('RecipeService', ['getRecipes']);
        const brewSpy = jasmine.createSpyObj('ScheduledBrewService', ['addScheduledBrew']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        await TestBed.configureTestingModule({
            declarations: [NewBrewingComponent],
            imports: [ReactiveFormsModule, RouterTestingModule],
            providers: [
                { provide: RecipeService, useValue: recipeSpy },
                { provide: ScheduledBrewService, useValue: brewSpy },
                {provide: Router, useValue: routerSpy}
            ]
        }).compileComponents();

        recipeServiceSpy = TestBed.inject(RecipeService) as jasmine.SpyObj<RecipeService>;
        brewServiceSpy = TestBed.inject(ScheduledBrewService) as jasmine.SpyObj<ScheduledBrewService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewBrewingComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch recipes from service', () => {
        const recipes: Recipe[] = [
            { id: "1", name: 'Recipe 1', ingredients: [] },
            { id: "2", name: 'Recipe 2',  ingredients: [] },
        ];
        recipeServiceSpy.getRecipes.and.returnValue(of(recipes));
        fixture.detectChanges();
        expect(component.recipes$).toBeDefined();
        component.recipes$?.subscribe((result) => {
            expect(result).toEqual(recipes);
        });
    });

    it('should show error if recipe is not selected', () => {
        const recipes: Recipe[] = [
            { id: "1", name: 'Recipe 1', ingredients: [] },
            { id: "2", name: 'Recipe 2',  ingredients: [] },
        ];
        recipeServiceSpy.getRecipes.and.returnValue(of(recipes));

        fixture.detectChanges();
        expect(component.form.valid).toBeFalse();

        const recipeSelect: DebugElement = fixture.debugElement.query(By.css('#recipe'));
        const recipeSelectElement = recipeSelect.nativeElement;
        recipeSelectElement.value = '1';
        recipeSelect.triggerEventHandler('change', { target: recipeSelectElement });
        fixture.detectChanges();

        recipeSelectElement.value = '0';
        recipeSelect.triggerEventHandler('change', { target: recipeSelectElement });

        fixture.detectChanges();
        expect(component.form.valid).toBeFalse();

        const errorSpan = fixture.debugElement.query(By.css('span[data-testid="required-recipe"]'));
        expect(errorSpan.nativeElement.textContent.trim()).toEqual('*please select a recipe');
    });

    it('should validate the form with dateGreaterOrEqualThanTodayValidator()', () => {
        const recipes: Recipe[] = [
            { id: "1", name: 'Recipe 1', ingredients: [] },
            { id: "2", name: 'Recipe 2',  ingredients: [] },
        ];
        recipeServiceSpy.getRecipes.and.returnValue(of(recipes));

        fixture.detectChanges();
        expect(component.form.valid).toBeFalse();

        const dateInput: DebugElement = fixture.debugElement.query(By.css('#date'));
        const dateInputElement = dateInput.nativeElement;

        dateInputElement.value = '2021-01-01';
        dateInput.triggerEventHandler('input', { target: dateInputElement });

        fixture.detectChanges();
        expect(component.form.valid).toBeFalse();

        const errorSpan: DebugElement = fixture.debugElement.query(By.css('span[data-testid="required-date"]'));
        expect(errorSpan.nativeElement.textContent.trim()).toEqual('*please select a date that is not in the past');
    });

});
