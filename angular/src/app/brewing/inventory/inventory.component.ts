import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatestWith, concat, debounceTime, map, Observable, take } from "rxjs";
import { Ingredient } from "./ingredient/ingredient.interface";
import { IngredientService } from "./ingredient/ingredient.service";
import { Sort } from "@angular/material/sort";
import { IngredientViewService } from "./ingredient-view.service";
import { cloneDeep } from "lodash";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.css']
})
export class InventoryComponent implements OnInit {
  constructor(
    private ingredientService: IngredientService,
    private ingredientViewService: IngredientViewService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ingredients$?: Observable<Ingredient[]>;
  search$ = new BehaviorSubject("");
  sort$ = new BehaviorSubject({ active: '', direction: '' } as Sort);
  pageSizeEmitter$ = new BehaviorSubject(5);

  /**
   * Initializes the component.
   * Sets up observables for fetching and filtering ingredients.
   */
  ngOnInit(): void {
    const debouncedSearch$ = concat(
      this.search$.pipe(take(1)),
      this.search$.pipe(debounceTime(500))
    );

    this.ingredients$ = this.ingredientService.getIngredients().pipe(
      combineLatestWith(debouncedSearch$, this.sort$, this.route.queryParams, this.pageSizeEmitter$),
      map(([ingredients, search, sort, page, pageSize]) => {
        let result = cloneDeep(ingredients);
        result = this.ingredientViewService.filterBySearchKeyword(result, search);
        result = this.ingredientViewService.sortIngredients(result, sort);
        result = this.ingredientViewService.filterByRecentPage(result, page['page'], pageSize)
        return result;
      }),
    );
  }

  /**
   * Sorts the ingredient data based on the given sorting parameters.
   * @param sort The sorting parameters.
   */
  public sortData(sort: Sort): void {
    this.sort$.next(sort);
  }

  /**
   * Navigates to the page for creating a new inventory item.
   */
  public navigateToNewItem(): void {
    this.router.navigateByUrl("/inventory/new");
  }

  /**
   * Handles the change event when the user selects a different page size.
   * @param value The selected value for the page size.
   */
  public selectChanged(value: any): void {
    this.pageSizeEmitter$.next(parseInt(value.target.value));
  }
}
