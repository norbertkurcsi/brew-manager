import { Component, Input } from "@angular/core";
import { ScheduledBrew } from "../interfaces/schedules-brews.interface";
import { ScheduledBrewService } from "../services/scheduled-brew.service";

@Component({
    selector: 'tr[scheduled-item]',
    templateUrl: 'scheduled-item.component.html',
    styleUrls: ['scheduled-item.component.css']
})
export class ScheduledItemComponent {
    constructor(
        private brewServives : ScheduledBrewService
    ) {}
    @Input() brewing?: ScheduledBrew;

    deleteScheduledBrew() {
        if (!this.brewing)
            return;
        this.brewServives.deleteScheduledBrew(this.brewing).subscribe({
            error: err => alert(err.message)
        });
    }
}