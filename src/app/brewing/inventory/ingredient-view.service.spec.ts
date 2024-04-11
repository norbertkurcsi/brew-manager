import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientViewService } from './ingredient-view.service';
import { Ingredient } from './ingredient/ingredient.interface';
import { Sort } from '@angular/material/sort';

describe('IngredientViewService', () => {
    let service: IngredientViewService;
    let routerSpy: jasmine.SpyObj<Router>;
    let routeSpy: jasmine.SpyObj<ActivatedRoute>;

    beforeEach(() => {
        const router = jasmine.createSpyObj('Router', ['navigate']);
        const route = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { queryParams: {} } });

        TestBed.configureTestingModule({
            providers: [
                IngredientViewService,
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: route }
            ]
        });

        service = TestBed.inject(IngredientViewService);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        routeSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    });

    describe('filterBySearchKeyword', () => {
        it('should return all ingredients when search keyword is empty', () => {
            const ingredients: Ingredient[] = [
                { id: 1, name: 'Salt', stock: 10, threshold: 2 },
                { id: 2, name: 'Sugar', stock: 5, threshold: 2 },
                { id: 3, name: 'Flour', stock: 20, threshold: 2 }
            ];
            const filtered = service.filterBySearchKeyword(ingredients, '');
            expect(filtered).toEqual(ingredients);
        });

        it('should filter ingredients by search keyword', () => {
            const ingredients: Ingredient[] = [
                { id: 1, name: 'Salt', stock: 10, threshold: 2 },
                { id: 2, name: 'Sugar', stock: 5, threshold: 2 },
                { id: 3, name: 'Flour', stock: 20, threshold: 2 }
            ];
            const filtered = service.filterBySearchKeyword(ingredients, 'Salt');
            expect(filtered).toEqual([{ id: 1, name: 'Salt', stock: 10, threshold: 2 }]);
        });
    });

    describe('filterByRecentPage', () => {
        it('should return the first page by default when the parameter is undefined', () => {
            const ingredients : Ingredient[] = [
                { id: 1, name: 'Salt', stock: 10, threshold:2 },
                { id: 2, name: 'Pepper', stock: 5, threshold:2 },
                { id: 3, name: 'Sugar', stock: 8, threshold:2 },
                { id: 4, name: 'Flour', stock: 20, threshold:2 }
            ];

            const filteredIngredients = service.filterByRecentPage(ingredients, undefined, 2);

            expect(filteredIngredients).toEqual([
                { id: 1, name: 'Salt', stock: 10, threshold:2 },
                { id: 2, name: 'Pepper', stock: 5, threshold:2 }
            ]);
        });

        it('should return the corresponding page when the parameter is a number within the range of pages', () => {
            const ingredients = [
                { id: 1, name: 'Salt', stock: 10, threshold:2 },
                { id: 2, name: 'Pepper', stock: 5, threshold:2 },
                { id: 3, name: 'Sugar', stock: 8, threshold:2 },
                { id: 4, name: 'Flour', stock: 20, threshold:2 }
            ];

            const filteredIngredients = service.filterByRecentPage(ingredients, '2', 2);

            expect(filteredIngredients).toEqual([
                { id: 3, name: 'Sugar', stock: 8, threshold:2 },
                { id: 4, name: 'Flour', stock: 20, threshold:2 }
            ]);
        });

        it('should navigate to the last page and return an empty array when the parameter is a number outside the range of pages', () => {
            const ingredients = [
                { id: 1, name: 'Salt', stock: 10, threshold:2 },
                { id: 2, name: 'Pepper', stock: 5, threshold:2 },
                { id: 3, name: 'Sugar', stock: 8, threshold:2 },
                { id: 4, name: 'Flour', stock: 20, threshold:2 }
            ];

            const filteredIngredients = service.filterByRecentPage(ingredients, '5', 2);

            expect(filteredIngredients).toEqual([]);
            expect(routerSpy.navigate).toHaveBeenCalledWith([], {
                relativeTo: routeSpy,
                queryParams: { page: 2 }
            });
        });

        it('should return an empty array when the parameter is not a number', () => {
            const ingredients = [
                { id: 1, name: 'Salt', stock: 10, threshold:2 },
                { id: 2, name: 'Pepper', stock: 5, threshold:2 },
                { id: 3, name: 'Sugar', stock: 8, threshold:2 },
                { id: 4, name: 'Flour', stock: 20, threshold:2 }
            ];

            const filteredIngredients = service.filterByRecentPage(ingredients, 'invalid', 2);

            expect(filteredIngredients).toEqual([]);
        });  
    });

    describe('sortIngredients',() => {
        it('should sort by ID in ascending order', () => {
            const ingredients: Ingredient[] = [
                { id: 2, name: 'Sugar', stock: 10, threshold:2  },
                { id: 3, name: 'Flour', stock: 5, threshold:2  },
                { id: 1, name: 'Salt', stock: 3, threshold:2  },
            ];
            const expectedSortedIngredients: Ingredient[] = [
                { id: 1, name: 'Salt', stock: 3, threshold:2  },
                { id: 2, name: 'Sugar', stock: 10, threshold:2  },
                { id: 3, name: 'Flour', stock: 5, threshold:2  },
            ];
            const sort: Sort = { active: 'id', direction: 'asc' };
            const service = TestBed.inject(IngredientViewService);

            const sortedIngredients = service.sortIngredients(ingredients, sort);

            expect(sortedIngredients).toEqual(expectedSortedIngredients);
        });

        it('should sort by ID in descending order', () => {
            const ingredients: Ingredient[] = [
                { id: 2, name: 'Sugar', stock: 10, threshold:2 },
                { id: 3, name: 'Flour', stock: 5, threshold:2 },
                { id: 1, name: 'Salt', stock: 3, threshold:2 },
            ];
            const expectedSortedIngredients: Ingredient[] = [
                { id: 3, name: 'Flour', stock: 5, threshold:2 },
                { id: 2, name: 'Sugar', stock: 10, threshold:2 },
                { id: 1, name: 'Salt', stock: 3, threshold:2 },
            ];
            const sort: Sort = { active: 'id', direction: 'desc' };
            const service = TestBed.inject(IngredientViewService);

            const sortedIngredients = service.sortIngredients(ingredients, sort);

            expect(sortedIngredients).toEqual(expectedSortedIngredients);
        });

        it('should sort by name in ascending order', () => {
            const ingredients: Ingredient[] = [
                { id: 2, name: 'Sugar', stock: 10, threshold:2 },
                { id: 3, name: 'Flour', stock: 5, threshold:2 },
                { id: 1, name: 'Salt', stock: 3, threshold:2 },
            ];
            const expectedSortedIngredients: Ingredient[] = [
                { id: 3, name: 'Flour', stock: 5, threshold:2 },
                { id: 1, name: 'Salt', stock: 3, threshold:2 },
                { id: 2, name: 'Sugar', stock: 10, threshold:2 },
            ];
            const sort: Sort = { active: 'name', direction: 'asc' };
            const service = TestBed.inject(IngredientViewService);

            const sortedIngredients = service.sortIngredients(ingredients, sort);

            expect(sortedIngredients).toEqual(expectedSortedIngredients);
        });

        it('should sort ingredients by stock in descending order', () => {
            const ingredients: Ingredient[] = [
                {id: 1, name: 'Sugar', stock: 50, threshold:2},
                {id: 2, name: 'Flour', stock: 25, threshold:2},
                {id: 3, name: 'Salt', stock: 75, threshold:2}
            ];
            const sort: Sort = {active: 'stock', direction: 'desc'};
            const sortedIngredients = service.sortIngredients(ingredients, sort);
            expect(sortedIngredients).toEqual([
                {id: 3, name: 'Salt', stock: 75, threshold:2},
                {id: 1, name: 'Sugar', stock: 50, threshold:2},
                {id: 2, name: 'Flour', stock: 25, threshold:2}
            ]);
        });

        it('should return unsorted ingredients when Sort object is not active', () => {
            const ingredients = [
                { id: 1, name: 'Salt', stock: 10, threshold:2 },
                { id: 2, name: 'Pepper', stock: 5, threshold:2 },
                { id: 3, name: 'Sugar', stock: 7, threshold:2 }
            ];
            const sort: Sort = { active: '', direction: '' };
            const result = service.sortIngredients(ingredients, sort);
            expect(result).toEqual(ingredients);
        });

        it('should return the ingredients list without sorting when sort direction is set but sort active is not set', () => {
            const ingredients = [
                { id: 1, name: 'Salt', stock: 5, threshold:2 },
                { id: 2, name: 'Pepper', stock: 3, threshold:2 },
                { id: 3, name: 'Garlic', stock: 7, threshold:2 }
            ];
            const sort: Sort = {
                active: 'valamimas',
                direction: 'desc'
            };
            const sortedIngredients = service.sortIngredients(ingredients, sort);
            expect(sortedIngredients).toEqual(ingredients);
        });
    })

});