import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { IngredientService } from "./ingredient.service";
import { TestBed } from "@angular/core/testing";
import { Ingredient } from "./ingredient.interface";
import { HttpErrorResponse } from "@angular/common/http";

describe('IngredientService', () => {
    let service: IngredientService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [IngredientService]
        });

        service = TestBed.inject(IngredientService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get a list of ingredients', () => {
        const mockIngredients: Ingredient[] = [
            { id: "1", name: 'Salt', stock: 2, threshold: 3 },
            { id: "2", name: 'Pepper', stock: 2, threshold: 3 },
            { id: "3", name: 'Sugar', stock: 2, threshold: 3 }
        ];
        let actualIngredients: Ingredient[] | undefined;

        service.getIngredients().subscribe((ingredients) => {
            actualIngredients = ingredients;
        });

        const req = httpMock.expectOne('http://localhost:3000/inventory');
        expect(req.request.method).toBe('GET');
        req.flush(mockIngredients);

        expect(actualIngredients).toEqual(mockIngredients);
    });

    it('should delete an ingredient if it is not used in recipes', () => {
        const mockIngredient: Ingredient = { id: "2", name: 'Pepper', stock: 2, threshold: 3 };

        service.deleteIngredient(mockIngredient).subscribe({
            next: (val) => { expect(val).toBeTruthy() },
            error: () => { expect().nothing()}
        });

        const req = httpMock.expectOne('http://localhost:3000/recipes');
        expect(req.request.method).toBe('GET');
        req.flush([{id: 1, name: "Crazy racoon", ingredients: []}]);

        const req2 = httpMock.expectOne(`http://localhost:3000/inventory/${mockIngredient.id}`);
        expect(req2.request.method).toBe('DELETE');
        req2.flush({});
    });

    it('should throw an error if we want to delete an ingredients that is in the recipes', () => {
        const mockIngredient: Ingredient = { id: "2", name: 'Pepper', stock: 2, threshold: 3 };

        service.deleteIngredient(mockIngredient).subscribe({
            next: () => { expect().nothing() },
            error: (err) => { expect(err).toBeTruthy()}
        });

        const req = httpMock.expectOne('http://localhost:3000/recipes');
        expect(req.request.method).toBe('GET');
        req.flush([{id: 1, name: "Crazy racoon", ingredients: [mockIngredient]}]);

        httpMock.expectNone(`http://localhost:3000/inventory/${mockIngredient.id}`);
    });

    it('should get an ingredient by id', () => {
        const mockIngredient: Ingredient = { id: "2", name: 'Pepper', stock: 2, threshold: 3 };
        let actualIngredient: Ingredient | undefined;

        service.getIngredientById(String(mockIngredient.id)).subscribe((ingredient) => {
            actualIngredient = ingredient;
        });

        const req = httpMock.expectOne(`http://localhost:3000/inventory/${mockIngredient.id}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockIngredient);

        expect(actualIngredient).toEqual(mockIngredient);
    });

    it('should throw an error if ingredient with requested id not exists', () => {
        const mockIngredient: Ingredient = { id: "2", name: 'Pepper', stock: 2, threshold: 3 };
        const status = 404;
        const statusText = 'Not found';
        const errorEvent = new ErrorEvent('API error');

        let actualError : HttpErrorResponse | undefined;

        service.getIngredientById(String(mockIngredient.id)).subscribe({
            next: () => fail('next handler must not be called'),
            error: err => actualError = err,
            complete: () => fail('complete handler must not be called')
        });

        httpMock.expectOne(`http://localhost:3000/inventory/${mockIngredient.id}`).error(
            errorEvent,
            { status, statusText }
        );

        if (!actualError) {
            throw new Error('Error needs to be defined');
        }
        expect(actualError.error).toBe(errorEvent);
        expect(actualError.status).toBe(status);
        expect(actualError.statusText).toBe(statusText);
    });

    it('should edit an ingredient', () => {
        const mockIngredient: Ingredient = { id: "2", name: 'Pepper', stock: 2, threshold: 3 };
        let actualIngredient: Ingredient | undefined;

        service.editIngredient(mockIngredient).subscribe((ingredient) => {
            actualIngredient = ingredient;
        });

        const req = httpMock.expectOne(`http://localhost:3000/inventory/${mockIngredient.id}`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(mockIngredient);
        req.flush(mockIngredient);

        expect(actualIngredient).toEqual(mockIngredient);
    });

    it('should add an ingredient', () => {
        const mockIngredient: Ingredient = { id: "2", name: 'Pepper', stock: 2, threshold: 3 };

        service.addItem(mockIngredient).subscribe((ingredient) => {
            expect(ingredient).toEqual(mockIngredient);
        });

        const req = httpMock.expectOne('http://localhost:3000/inventory');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockIngredient);
        req.flush(mockIngredient);
    });
});
