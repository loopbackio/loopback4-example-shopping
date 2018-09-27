import {Entity, model, property} from '@loopback/repository';

@model()
export class Product extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  productId: string;

  @property({
    type: 'string',
    required: true,
    id: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}
