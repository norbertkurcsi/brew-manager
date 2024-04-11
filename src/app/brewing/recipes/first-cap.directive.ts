import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[firstCap]'
})
export class FirstCapDirective {
    constructor(private ref: ElementRef) { }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        if (event.target.value.length > 0) {
            const inputValue = event.target.value;
            this.ref.nativeElement.value = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
        }
    }
}