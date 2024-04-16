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

  /**
   * Initializes the current page from the query parameters.
   * If the 'page' query parameter exists, returns its value as the current page number. Otherwise, returns 1.
   * @returns The current page number.
   */
  private initCurrentPage(): number {
    let queryParams = this.route.snapshot.queryParams;
    let currentPage: number = 1;
    if (queryParams.hasOwnProperty('page')) {
      currentPage = queryParams['page'];
    }

    return currentPage;
  }

  /**
   * Advances to the next page.
   * Increments the current page number and navigates to the updated URL with the new page parameter.
   */
  public stepOnNextPage(): void {
    let currentPage = this.initCurrentPage();

    currentPage++;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { page: currentPage }
      }
    );
  }

  /**
   * Moves to the previous page.
   * Decrements the current page number (if greater than 1) and navigates to the updated URL with the new page parameter.
   */
  public stepOnPrevPage(): void {
    let currentPage = this.initCurrentPage();

    if (currentPage > 1) currentPage--;

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { page: currentPage }
      }
    );
  }
}
