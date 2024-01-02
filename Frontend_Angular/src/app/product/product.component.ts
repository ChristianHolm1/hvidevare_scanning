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
    
    if(this.product.product_img == "Not available"){
      this.product.product_img = "assets/invalid_product_img.png";
    } 
  }
  @Input() product: Product = new Product('', '', '', "", "", "", "");

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  checkEnergyLabel() {
    
    switch (this.product.productLabel) {
      case "OldLabel":
        this.renderer.addClass(this.el.nativeElement, 'old');
        break;
        case "NewLabel":
        this.renderer.addClass(this.el.nativeElement, 'new');
        break;
      default:
        this.renderer.addClass(this.el.nativeElement, 'invalid');
        break;
    }
  }
}
