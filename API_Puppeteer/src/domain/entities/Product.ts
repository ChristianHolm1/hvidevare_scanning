import { ProductIF } from "../Interfaces/ProductIF";

export class Product implements ProductIF {
  title: string;
  price: string;
  rating: string;
  productImage: string;
  productLink: string;  
  productEnergyImg: string;

  constructor(
    title: string,
    price: string,
    rating: string,
    productImage: string,
    productLink: string,
    productEnergyImg: string,
  ){
    this.title = title;
    this.price = price;
    this.rating = rating;
    this.productImage = productImage;
    this.productLink = productLink;
    this.productEnergyImg = productEnergyImg;
  }

  toString(): string {
    return `Product Information:
    Title: ${this.title}
    Price: ${this.price}
    Rating: ${this.rating}
    Image: ${this.productImage}
    Link: ${this.productLink}
    Energy Image: ${this.productEnergyImg}
    Specifications:
    ----------------------------------`;
  }
}
