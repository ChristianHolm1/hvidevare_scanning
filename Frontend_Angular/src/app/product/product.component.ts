import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { Product } from '../shared/classes/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.checkEnergyLabel();
  }
  @Input() product: Product = new Product('', '', '', "", "", "");

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  checkEnergyLabel() {
    switch (this.product.productEnergyImg) {
      case "No eng img available":
        this.renderer.addClass(this.el.nativeElement, 'invalid');
        break;
      case "https://www.elgiganten.dk/content/icon/energyscales/apppg-appp.svg":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
      case "https://www.elgiganten.dk/content/icon/energyscales/apppg-app.svg":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
      case "https://www.elgiganten.dk/content/icon/energyscales/apppg-ap.svg":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
      case "https://www.elgiganten.dk/content/icon/energyscales/apppg-a.svg":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
      case "https://www.elgiganten.dk/content/icon/energyscales/apppg-b.svg":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
      case "https://www.elgiganten.dk/content/icon/energyscales/apppg-c.svg":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
      case "https://www.elgiganten.dk/content/icon/energyscales/apppg-d.svg":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
      default:
        this.renderer.addClass(this.el.nativeElement, 'valid');
        break;

    }
  }
}
