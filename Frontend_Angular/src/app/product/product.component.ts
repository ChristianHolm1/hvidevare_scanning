import { Component, Input } from '@angular/core';
import { Product } from '../shared/classes/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product:Product = new Product('', '', '', "", "", "");

  checkEnergyLabel() {
    if (this.product.productEnergyImg == "No eng img available") {
      document.getElementById('product')?.classList.add('old');
    }
  }
}
