import { ProductIF } from "../interfaces/ProductIF";

export class Product implements ProductIF {
  title: string;
  price: string;
  energy_rating: string;
  varenummer: string;
  product_img: string;
  url: string;  
  productLabel: string;

  constructor(
    title: string,
    price: string,
    energy_rating: string,
    varenummer: string,
    product_img: string,
    url: string,
    productLabel: string,
  ){
    this.title = title;
    this.price = price;
    this.energy_rating = energy_rating;
    this. varenummer =  varenummer;
    this.product_img = product_img;
    this.url = url;
    this.productLabel = productLabel;
  }

  toString(): string {
    return `Product Information:
    Title: ${this.title}
    Price: ${this.price}
    Energy Rating: ${this.energy_rating}
    Varenummer : ${this.varenummer}
    Image: ${this.product_img}
    Link: ${this.url}
    Product Label: ${this.productLabel}
    Specifications:
    ----------------------------------`;
  }
}

  
