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

    public filterBySearchKeyword(ingredients: Ingredient[], keyword: string): Ingredient[] {
        if (keyword === "") return ingredients;
        return ingredients.filter(ingredient => ingredient.name.includes(keyword));
    }

    private wrongParams(param : string | undefined, size: number): boolean {
        if (!param) return false;
        let parsed = parseInt(param);
        if (isNaN(parsed) || parsed < 1 || parsed > size) return true;
        return false;
    }

    public filterByRecentPage(ingredients: Ingredient[], param: string | undefined, size: number) {
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

    public sortIngredients(ingredients: Ingredient[], sort: Sort) {
        if (!sort.active || sort.direction === '') {
            return ingredients;
        }

        let sortedIngredients = ingredients.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id':
                    return this.compare(a.id, b.id, isAsc);
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

    private  compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}