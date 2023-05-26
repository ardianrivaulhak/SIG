import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @Input('appHighlight') highlightColor: string;

  @HostListener('click') onMouseClick() {
    this.highlight(this.highlightColor || 'red');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}