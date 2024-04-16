import { Component, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { cloneDeep } from "lodash";
import { BehaviorSubject, combineLatestWith, Observable, map } from "rxjs";
import { ScheduledBrew } from "./interfaces/schedules-brews.interface";
import { ScheduledBrewService } from "./services/scheduled-brew.service";

/**
 * Component for displaying and managing scheduled brewing.
 */
@Component({
  selector: 'scheduled-brewing',
  templateUrl: 'scheduled-brewing.component.html',
  styleUrls: ['scheduled-brewing.component.css']
})
export class ScheduledBrewingComponent implements OnInit {
  constructor(
    private brewingService: ScheduledBrewService,
    private router: Router
  ) { }

  /** Observable of scheduled brews. */
  brewings$?: Observable<ScheduledBrew[]>;

  /** BehaviorSubject for sorting configuration. */
  sort$ = new BehaviorSubject({ active: '', direction: '' } as Sort);

  ngOnInit(): void {
    this.brewings$ = this.brewingService.getBrewings().pipe(
      combineLatestWith(this.sort$),
      map(([brewings, sort]) => {
        let result = cloneDeep(brewings);
        result = this.brewingService.sortBrewings(result, sort);
        return result;
      })
    );
  }

  /**
   * Navigates to the page for creating a new scheduled brewing.
   */
  public navigateToNewBrewingPage(): void {
    this.router.navigateByUrl('scheduled-brewing/new');
  }

  /**
   * Sorts the data based on the provided sort configuration.
   * @param sort The sort configuration.
   */
  public sortData(sort: Sort): void {
    this.sort$.next(sort);
  }
}
