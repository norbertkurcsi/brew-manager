import { Component, Input } from "@angular/core";
import { ScheduledBrew } from "../interfaces/schedules-brews.interface";
import { ScheduledBrewService } from "../services/scheduled-brew.service";

/**
 * Component for displaying a single scheduled brewing item.
 */
@Component({
  selector: 'tr[scheduled-item]',
  templateUrl: 'scheduled-item.component.html',
  styleUrls: ['scheduled-item.component.css']
})
export class ScheduledItemComponent {
  constructor(
    private brewServives : ScheduledBrewService
  ) {}

  /** Input property representing the scheduled brewing item. */
  @Input() brewing?: ScheduledBrew;

  /**
   * Deletes the scheduled brewing item.
   * Displays an alert if an error occurs during the deletion process.
   */
  deleteScheduledBrew(): void {
    if (!this.brewing)
      return;
    this.brewServives.deleteScheduledBrew(this.brewing).subscribe({
      error: err => alert(err.message)
    });
  }
}
