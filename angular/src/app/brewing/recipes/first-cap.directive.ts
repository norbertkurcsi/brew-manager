import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: '[firstCap]'
})
export class FirstCapDirective {
  constructor(private ref: ElementRef) { }

  /**
   * Listens to the input event and capitalizes the first letter of the input value.
   * @param event - The input event.
   */
  @HostListener('input', ['$event'])
  onInput(event: any): void {
    if (event.target.value.length > 0) {
      const inputValue = event.target.value;
      this.ref.nativeElement.value = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
    }
  }
}
