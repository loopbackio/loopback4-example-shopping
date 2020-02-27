/* tslint:disable */
import { ShoppingCartItem } from './shopping-cart-item';
export interface Order {
  date?: string;
  fullName?: string;
  orderId?: string;
  products: Array<ShoppingCartItem>;
  total?: number;
  userId?: string;
}
