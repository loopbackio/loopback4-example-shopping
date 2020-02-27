/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartItem } from '../models/shopping-cart-item';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation shoppingCartControllerAddItem
   */
  static readonly ShoppingCartControllerAddItemPath = '/shoppingCarts/{userId}/items';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addItem()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addItem$Response(params: {
    userId: string;
  
    /**
     * shopping cart item
     */
    body?: ShoppingCartItem
  }): Observable<StrictHttpResponse<ShoppingCart>> {

    const rb = new RequestBuilder(this.rootUrl, ShoppingCartControllerService.ShoppingCartControllerAddItemPath, 'post');
    if (params) {

      rb.path('userId', params.userId);

      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ShoppingCart>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addItem$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addItem(params: {
    userId: string;
  
    /**
     * shopping cart item
     */
    body?: ShoppingCartItem
  }): Observable<ShoppingCart> {

    return this.addItem$Response(params).pipe(
      map((r: StrictHttpResponse<ShoppingCart>) => r.body as ShoppingCart)
    );
  }

  /**
   * Path part for operation shoppingCartControllerGet
   */
  static readonly ShoppingCartControllerGetPath = '/shoppingCarts/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `get()` instead.
   *
   * This method doesn't expect any request body.
   */
  get$Response(params: {
    userId: string;

  }): Observable<StrictHttpResponse<ShoppingCart>> {

    const rb = new RequestBuilder(this.rootUrl, ShoppingCartControllerService.ShoppingCartControllerGetPath, 'get');
    if (params) {

      rb.path('userId', params.userId);

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ShoppingCart>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `get$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  get(params: {
    userId: string;

  }): Observable<ShoppingCart> {

    return this.get$Response(params).pipe(
      map((r: StrictHttpResponse<ShoppingCart>) => r.body as ShoppingCart)
    );
  }

  /**
   * Path part for operation shoppingCartControllerSet
   */
  static readonly ShoppingCartControllerSetPath = '/shoppingCarts/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `set()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  set$Response(params: {
    userId: string;
  
    /**
     * shopping cart
     */
    body?: ShoppingCart
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ShoppingCartControllerService.ShoppingCartControllerSetPath, 'put');
    if (params) {

      rb.path('userId', params.userId);

      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `set$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  set(params: {
    userId: string;
  
    /**
     * shopping cart
     */
    body?: ShoppingCart
  }): Observable<void> {

    return this.set$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation shoppingCartControllerCreate
   */
  static readonly ShoppingCartControllerCreatePath = '/shoppingCarts/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create$Response(params: {
    userId: string;
  
    /**
     * shopping cart
     */
    body?: ShoppingCart
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ShoppingCartControllerService.ShoppingCartControllerCreatePath, 'post');
    if (params) {

      rb.path('userId', params.userId);

      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `create$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create(params: {
    userId: string;
  
    /**
     * shopping cart
     */
    body?: ShoppingCart
  }): Observable<void> {

    return this.create$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation shoppingCartControllerRemove
   */
  static readonly ShoppingCartControllerRemovePath = '/shoppingCarts/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `remove()` instead.
   *
   * This method doesn't expect any request body.
   */
  remove$Response(params: {
    userId: string;

  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ShoppingCartControllerService.ShoppingCartControllerRemovePath, 'delete');
    if (params) {

      rb.path('userId', params.userId);

    }
    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `remove$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  remove(params: {
    userId: string;

  }): Observable<void> {

    return this.remove$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
