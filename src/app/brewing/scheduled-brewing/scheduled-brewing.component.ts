import { Component, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { cloneDeep } from "lodash";
import { BehaviorSubject, combineLatestWith, Observable, map } from "rxjs";
import { ScheduledBrew } from "./interfaces/schedules-brews.interface";
import { ScheduledBrewService } from "./services/scheduled-brew.service";

@Component({
    selector: 'scheduled-brewing',
    templateUrl: 'scheduled-brewing.component.html',
    styleUrls: ['scheduled-brewing.component.css']
})
export class ScheduledBrewingComponent implements OnInit{
    constructor(
        private brewingService: ScheduledBrewService,
        private router: Router
    ) { }
    
    brewings$?: Observable<ScheduledBrew[]>;
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

    public navigateToNewBrewingPage() {
        this.router.navigateByUrl('scheduled-brewing/new');
    }

    public sortData(sort: Sort) {
        this.sort$.next(sort);
    }
}