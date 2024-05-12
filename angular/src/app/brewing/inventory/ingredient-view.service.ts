import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { ActivatedRoute, Router } from "@angular/router";
import { toInteger } from "lodash";
import { Ingredient } from "./ingredient/ingredient.interface";

@Injectable({
  providedIn: 'root'
})
export class IngredientViewService {
  constructor(private router: Router, private route: ActivatedRoute){}

  /**
   * Filters the list of ingredients by a search keyword.
   * @param ingredients The list of ingredients to filter.
   * @param keyword The search keyword to filter by.
   * @returns The filtered list of ingredients.
   */
  public filterBySearchKeyword(ingredients: Ingredient[], keyword: string): Ingredient[] {
    if (keyword === "") return ingredients;
    return ingredients.filter(ingredient => ingredient.name.includes(keyword));
  }

  /**
   * Filters the list of ingredients based on the current page.
   * If the provided page parameter is invalid, navigates to the last valid page.
   * @param ingredients The list of ingredients to paginate.
   * @param param The page parameter.
   * @param size The number of items per page.
   * @returns The paginated list of ingredients.
   */
  public filterByRecentPage(ingredients: Ingredient[], param: string | undefined, size: number): Ingredient[] {
    let pageCount = toInteger((ingredients.length + size - 1) / size);
    if (this.wrongParams(param, pageCount)) {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {page: pageCount}
        }
      );
      return [];
    }

    let page: number;
    if (!param) page = 1;
    else page = parseInt(param);

    let firstIndex = (page - 1) * size;
    return ingredients.slice(firstIndex, firstIndex + size);
  }

  /**
   * Sorts the list of ingredients based on the provided sorting parameters.
   * @param ingredients The list of ingredients to sort.
   * @param sort The sorting parameters.
   * @returns The sorted list of ingredients.
   */
  public sortIngredients(ingredients: Ingredient[], sort: Sort): Ingredient[] {
    if (!sort.active || sort.direction === '') {
      return ingredients;
    }

    let sortedIngredients = ingredients.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compare(a.id!, b.id!, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'stock':
          return this.compare(a.stock, b.stock, isAsc);
        default:
          return 0;
      }
    });

    return sortedIngredients;
  }

  private wrongParams(param: string | undefined, size: number): boolean {
    if (!param) return false;
    let parsed = parseInt(param);
    if (isNaN(parsed) || parsed < 1 || parsed > size) return true;
    return false;
  }

  private  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
