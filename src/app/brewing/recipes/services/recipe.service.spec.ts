import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { Ingredient } from "../../inventory/ingredient/ingredient.interface";
import { IngredientService } from "../../inventory/ingredient/ingredient.service";
import { RecipeService } from "./recipe.service";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { defer, of, take } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../interfaces/recipe.interface";

const mockIngredients: Ingredient[] = [
    { id: 1, name: 'fincsa', threshold:2, stock:3 },
    { id: 2, name: 'mincsa', threshold:2, stock:3 },
    { id: 3, name: 'habos', threshold:2, stock:3 },
    { id: 3, name: 'babos', threshold:2, stock:3 },
];

describe('RecipeService', () => {
    let service: RecipeService;
    let ingredientServiceSpy = jasmine.createSpyObj('IngredientService', ['getIngredients']);
    let httpMock: HttpTestingController;

    beforeEach(() => {
        ingredientServiceSpy = jasmine.createSpyObj('IngredientService', ['getIngredients']);
        ingredientServiceSpy.getIngredients.and.returnValue(of(mockIngredients));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: IngredientService, useValue: ingredientServiceSpy }
            ]
        });
        service = TestBed.inject(RecipeService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should return recipes with ingredient names', () => {
        const recipes: Recipe[] = [
            { id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 2 }, { id: 2, amount: 3 }] },
            { id: 2, name: 'Recipe 2', ingredients: [{ id: 1, amount: 1 }, { id: 3, amount: 2 }] },
        ];
        
        let result: Recipe[] = [];

        service.getRecipes().subscribe(recipes => {
            result = recipes;
        });

        const req = httpMock.expectOne('http://localhost:3000/recipes');
        expect(req.request.method).toEqual('GET');
        req.flush(recipes);
        expect(result).toEqual([
            {
            id: 1,
            name: 'Recipe 1',
            ingredients: [
                { id: 1, amount: 2, name: 'fincsa' },
                { id: 2, amount: 3, name: 'mincsa' },
            ]
            },
            {
            id: 2,
            name: 'Recipe 2',
            ingredients: [
                { id: 1, amount: 1, name: 'fincsa' },
                { id: 3, amount: 2, name: 'habos' },
            ]
            },
        ]);
        expect(ingredientServiceSpy.getIngredients).toHaveBeenCalled();
    });

   it('should emit recipes every 3 seconds', fakeAsync(() => {
        const recipes: Recipe[] = [
            { id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 2 }, { id: 2, amount: 3 }] },
            { id: 2, name: 'Recipe 2', ingredients: [{ id: 1, amount: 1 }, { id: 3, amount: 2 }] },
        ];


        let result: Recipe[] = [];
        let count = 0;

        service.getRecipes().pipe(take(3)).subscribe(recipes => {
            result = recipes;
            count++;
        });

        expect(result).toEqual([]);

        tick(3000);
        httpMock.expectOne('http://localhost:3000/recipes').flush(recipes);

        expect(result).toEqual(recipes);
        expect(count).toEqual(1);

        tick(3000);
        httpMock.expectOne('http://localhost:3000/recipes').flush(recipes);

        expect(result).toEqual(recipes);
        expect(count).toEqual(2);

        tick(3000);
        httpMock.expectOne('http://localhost:3000/recipes').flush(recipes);

        expect(result).toEqual(recipes);
        expect(count).toEqual(3);
    }));
    
    it('should delete a recipe and emit the delete event', () => {
        const recipe: Recipe = { id: 1, name: 'Test Recipe', ingredients: [] };
        let actualRecipes: Recipe[] | undefined;

        service.getRecipes().pipe(take(2)).subscribe((recipes) => {
            actualRecipes = recipes;
        });

        const req1 = httpMock.expectOne(`http://localhost:3000/recipes`);
        expect(req1.request.method).toEqual('GET');
        req1.flush([recipe]);
        expect(actualRecipes).toEqual([recipe]);

        service.deleteRecipe(recipe).subscribe();

        const deleteReq = httpMock.expectOne(`http://localhost:3000/recipes/${recipe.id}`);
        expect(deleteReq.request.method).toEqual('DELETE');
        deleteReq.flush(recipe);

        const req2 = httpMock.expectOne(`http://localhost:3000/recipes`);
        expect(req2.request.method).toEqual('GET');
        req2.flush([]);
        expect(actualRecipes).toEqual([]);
    });

    it('should give back the recipe with name of the given id', () => {
        const recipe: Recipe = { id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 2 }, { id: 2, amount: 3 }] };

        let actualRecipe: Recipe | undefined;

        service.getRecipeById(String(recipe.id)).subscribe((recipe) => {
            actualRecipe = recipe;
        });

        const req = httpMock.expectOne(`http://localhost:3000/recipes/${recipe.id}`);
        expect(req.request.method).toEqual('GET');
        req.flush(recipe);
        expect(actualRecipe).toEqual(
            {
                id: 1,
                name: 'Recipe 1',
                ingredients: [
                    { id: 1, amount: 2, name: 'fincsa' },
                    { id: 2, amount: 3, name: 'mincsa' },
                ]
            }
        );
        expect(ingredientServiceSpy.getIngredients).toHaveBeenCalled();
    });

    it('should retrieve recipes', () => {
        const recipes: Recipe[] = [
            { id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 2 }, { id: 2, amount: 3 }] },
            { id: 2, name: 'Recipe 2', ingredients: [{ id: 1, amount: 1 }, { id: 3, amount: 2 }] },
        ];
        let actualRecipes: Recipe[] | undefined;

        service.getRecipesRaw().subscribe(recipes => {
            actualRecipes = recipes;
        });

        const req = httpMock.expectOne('http://localhost:3000/recipes');
        expect(req.request.method).toBe('GET');
        req.flush(recipes);

        expect(actualRecipes).toEqual(recipes);
    });

    it('should retrieve recipes', () => {
        const recipe: Recipe = { id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 2 }, { id: 2, amount: 3 }] };
        let actualRecipe: Recipe | undefined;

        service.getRecipeRawById(String(recipe.id)).subscribe(recipe => {
            actualRecipe = recipe;
        });

        const req = httpMock.expectOne(`http://localhost:3000/recipes/${recipe.id}`);
        expect(req.request.method).toBe('GET');
        req.flush(recipe);

        expect(actualRecipe).toEqual(recipe);
    });

    it('should retrieve recipes', () => {
        const recipe: Recipe = { id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 2 }, { id: 2, amount: 3 }] };
        let actualRecipe: Recipe | undefined;

        service.editRecipe(recipe).subscribe(recipe => {
            actualRecipe = recipe;
        });

        const req = httpMock.expectOne(`http://localhost:3000/recipes/${recipe.id}`);
        expect(req.request.method).toBe('PUT');
        req.flush(recipe);

        expect(actualRecipe).toEqual(recipe);
    });

    it('should retrieve recipes', () => {
        const recipe: Recipe = { id: 1, name: 'Recipe 1', ingredients: [{ id: 1, amount: 2 }, { id: 2, amount: 3 }] };
        let actualRecipe: Recipe | undefined;

        service.addRecipe(recipe).subscribe(recipe => {
            actualRecipe = recipe;
        });

        const req = httpMock.expectOne(`http://localhost:3000/recipes`);
        expect(req.request.method).toBe('POST');
        req.flush(recipe);

        expect(actualRecipe).toEqual(recipe);
    });

})