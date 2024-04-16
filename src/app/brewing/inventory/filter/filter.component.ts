import { Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
  selector: 'filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css']
})
export class FilterComponent {
  @Input() search?: Subject<string>;

  form = new FormGroup({
    search: new FormControl()
  });

  /**
   * Emits the search term to the parent component when the value of the search input changes.
   */
  public valueChange(): void {
    this.search?.next(this.form.value.search);
  }
}
