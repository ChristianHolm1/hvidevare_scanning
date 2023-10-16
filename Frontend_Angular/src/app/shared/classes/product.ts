export class Product {
    title: string;
    price: string;
    image: string;
    specs: { key: string; value: string }[];
  
    constructor(
      title: string,
      price: string,
      image: string,
      specs: { key: string; value: string }[]
    ) {
      this.title = title;
      this.price = price;
      this.image = image;
      this.specs = specs;
    }
  }
  
