"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(title, price, rating, productImage, productLink, productEnergyImg) {
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.productImage = productImage;
        this.productLink = productLink;
        this.productEnergyImg = productEnergyImg;
    }
    toString() {
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
exports.Product = Product;
