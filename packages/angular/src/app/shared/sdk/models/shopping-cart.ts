/* tslint:disable */
import { ShoppingCartItem } from './shopping-cart-item';
export interface ShoppingCart {
  items?: Array<ShoppingCartItem>;
  userId?: string;
}
