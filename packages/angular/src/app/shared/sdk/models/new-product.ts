/* tslint:disable */

/**
 * (Schema options: { title: 'NewProduct', exclude: [ 'productId' ] })
 */
export interface NewProduct {
  description?: string;
  details?: string;
  image?: string;
  name: string;
  price: number;
}
