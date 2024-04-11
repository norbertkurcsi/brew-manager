import { AfterViewInit, Component, EventEmitter, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
    selector: 'filter',
    templateUrl: 'filter.component.html',
    styleUrls: ['filter.component.css']
})
export class FilterComponent{
    @Input() search?: Subject<string>;

    form = new FormGroup({
        search: new FormControl()
    });

    public valueChange() {
        this.search?.next(this.form.value.search);
    }
}