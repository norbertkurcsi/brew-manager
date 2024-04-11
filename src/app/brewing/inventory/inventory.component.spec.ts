import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of, take } from 'rxjs';
import { Ingredient } from './ingredient/ingredient.interface';
import { IngredientService } from './ingredient/ingredient.service';
import { InventoryComponent } from './inventory.component';
import { IngredientViewService } from './ingredient-view.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InventoryComponent', () => {
    let component: InventoryComponent;
    let fixture: ComponentFixture<InventoryComponent>;
    let mockIngredientService: jasmine.SpyObj<IngredientService>;
    let mockIngredientViewService: jasmine.SpyObj<IngredientViewService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRoute: jasmine.SpyObj<ActivatedRoute>;

    const ingredient1: Ingredient = { id: "1", name: 'Ingredient 1', stock: 5, threshold: 2 };
    const ingredient2: Ingredient = { id: "2", name: 'Ingredient 2', stock: 10, threshold: 5 };
    const ingredient3: Ingredient = { id: "3", name: 'Ingredient 3', stock: 3, threshold: 1 };
    const ingredients: Ingredient[] = [ingredient1, ingredient2, ingredient3];

    beforeEach(async () => {
        mockIngredientService = jasmine.createSpyObj('IngredientService', ['getIngredients']);
        mockIngredientViewService = jasmine.createSpyObj('IngredientViewService', ['filterBySearchKeyword', 'sortIngredients', 'filterByRecentPage']);
        mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
        mockRoute = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);

        await TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [InventoryComponent],
            providers: [
                { provide: IngredientService, useValue: mockIngredientService },
                { provide: IngredientViewService, useValue: mockIngredientViewService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockRoute }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InventoryComponent);
        component = fixture.componentInstance;
        mockIngredientService.getIngredients.and.returnValue(of(ingredients));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call sortData() and update the sort$ behavior subject', () => {
        const sort :  Sort = { active: 'name', direction: 'asc' };
        component.sortData(sort);
        expect(component.sort$.value).toEqual(sort);
    });

    it('should navigate to new item page on button click', () => {
        const button = fixture.debugElement.nativeElement.querySelector('#new-element');
        button.click();

        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/inventory/new');
    });

    it('should emit new page size when user selects a new page size', () => {
        const pageSizeEmitterSpy = spyOn(component.pageSizeEmitter$, 'next');
        const select = fixture.nativeElement.querySelector('select');

        select.value = '10';
        select.dispatchEvent(new Event('change'));

        fixture.detectChanges();

        expect(pageSizeEmitterSpy).toHaveBeenCalledWith(10);
    });


});
