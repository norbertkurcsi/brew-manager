import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: ['pagination.component.css']
})
export class PaginationComponent {
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    private initCurrentPage() {
        let queryParams = this.route.snapshot.queryParams;
        let currentPage: number = 1;
        if (queryParams.hasOwnProperty('page')) {
            currentPage = queryParams['page'];
        }

        return currentPage;
    }

    public stepOnNextPage() {
        let currentPage = this.initCurrentPage();

        currentPage++;

        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: {page: currentPage}
            }
        );
    }

    public stepOnPrevPage() {
        let currentPage = this.initCurrentPage();

        if (currentPage > 1) currentPage--;

        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: {page: currentPage}
            }
        );
    }
}