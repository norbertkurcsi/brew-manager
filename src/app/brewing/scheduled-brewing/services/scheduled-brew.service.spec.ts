import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { combineLatestWith } from 'rxjs/operators';
import { IngredientService } from '../../inventory/ingredient/ingredient.service';
import { RecipeService } from '../../recipes/services/recipe.service';
import { ScheduledBrewService } from './scheduled-brew.service';
import { ScheduledBrew } from '../interfaces/schedules-brews.interface';
import { Sort } from '@angular/material/sort';

describe('ScheduledBrewService', () => {
    let service: ScheduledBrewService;
    let httpMock: HttpTestingController;
    let ingredientServiceMock: jasmine.SpyObj<IngredientService>;
    let recipeServiceMock: jasmine.SpyObj<RecipeService>;

    beforeEach(() => {
        ingredientServiceMock = jasmine.createSpyObj('IngredientService', ['getIngredientById', 'getIngredients', 'editIngredient']);
        ingredientServiceMock.getIngredients.and.returnValue(of([{ id: 1, name: 'Ingredient 1', stock: 10, threshold: 5 }]));
        ingredientServiceMock.getIngredientById.and.returnValue(of({ id: 1, name: 'Ingredient 1', stock: 10, threshold: 5 }));
        ingredientServiceMock.editIngredient.and.returnValue(of({ id: 1, name: 'Ingredient 1', stock: 10, threshold: 5 }));

        recipeServiceMock = jasmine.createSpyObj('RecipeService', ['getRecipesRaw', 'getRecipeRawById']);
        recipeServiceMock.getRecipesRaw.and.returnValue(of([{ id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 5 }] }]));
        recipeServiceMock.getRecipeRawById.and.returnValue(of({ id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 5 }] }));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ScheduledBrewService,
                { provide: IngredientService, useValue: ingredientServiceMock },
                { provide: RecipeService, useValue: recipeServiceMock },
            ]
        });
        service = TestBed.inject(ScheduledBrewService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get brewings with recipe names', (done) => {
        service.getBrewings().subscribe((result) => {
            expect(result).toEqual([{ id: 1, recipe: 1, date: 123, recipeName: 'Recipe 1' }]);
            done();
        });

        const request = httpMock.expectOne('http://localhost:3000/scheduled-brews');
        request.flush([{ id: 1, recipe: 1, date: 123 }]);
    });

    describe('sortBrewings', () => {
        it('should return the unsorted array when sort is not active', () => {
            const brewings: ScheduledBrew[] = [
                { id: 1, recipe: 2, date:1 },
                { id: 2, recipe: 1, date:2 },
                { id: 3, recipe: 3, date:3 },
            ];
            const sort: Sort = { active: '', direction: '' };

            const result = service.sortBrewings(brewings, sort);

            expect(result).toEqual(brewings);
        });

        it('should sort the array in ascending order by date when sort direction is "asc"', () => {
            const brewings: ScheduledBrew[] = [
                { id: 1, recipe: 2, date: 1 },
                { id: 2, recipe: 1, date: 2 },
                { id: 3, recipe: 3, date: 3 },
            ];
            const sort: Sort = { active: 'date', direction: 'asc' };
            const expected: ScheduledBrew[] = [
                { id: 1, recipe: 2, date: 1 },
                { id: 2, recipe: 1, date: 2 },
                { id: 3, recipe: 3, date: 3 },
            ];

            const result = service.sortBrewings(brewings, sort);

            expect(result).toEqual(expected);
        });

        it('should sort the array in descending order by date when sort direction is "desc"', () => {
            const brewings: ScheduledBrew[] = [
                { id: 1, recipe: 2, date: 1 },
                { id: 2, recipe: 1, date: 2 },
                { id: 3, recipe: 3, date: 3 },
            ];
            const sort: Sort = { active: 'date', direction: 'desc' };
            const expected: ScheduledBrew[] = [
                { id: 3, recipe: 3, date: 3 },
                { id: 2, recipe: 1, date: 2 },
                { id: 1, recipe: 2, date: 1 },
            ];

            const result = service.sortBrewings(brewings, sort);

            expect(result).toEqual(expected);
        });

        it('should return the array unsorted if sort direction is invalid', () => {
            const brewings : ScheduledBrew[] = [
                { id: 1, recipe: 2, date: 1 },
                { id: 2, recipe: 1, date: 2 },
                { id: 3, recipe: 3, date: 3 },
            ];
            const sort: Sort = { active: 'valamimas', direction: 'desc' };
            const sortedBrewings = service.sortBrewings(brewings, sort);
            expect(sortedBrewings).toEqual(brewings);
        });
    });

    

});