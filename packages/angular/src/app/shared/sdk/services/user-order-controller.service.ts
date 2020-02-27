/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class UserOrderControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation userOrderControllerFindOrders
   */
  static readonly UserOrderControllerFindOrdersPath = '/users/{userId}/orders';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  findOrders$Response(params: {
    userId: string;
    filter?: string;

  }): Observable<StrictHttpResponse<Array<Order>>> {

    const rb = new RequestBuilder(this.rootUrl, UserOrderControllerService.UserOrderControllerFindOrdersPath, 'get');
    if (params) {

      rb.path('userId', params.userId);
      rb.query('filter', params.filter);

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Order>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findOrders(params: {
    userId: string;
    filter?: string;

  }): Observable<Array<Order>> {

    return this.findOrders$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Order>>) => r.body as Array<Order>)
    );
  }

  /**
   * Path part for operation userOrderControllerCreateOrder
   */
  static readonly UserOrderControllerCreateOrderPath = '/users/{userId}/orders';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createOrder$Response(params: {
    userId: string;
      body?: Order
  }): Observable<StrictHttpResponse<Order>> {

    const rb = new RequestBuilder(this.rootUrl, UserOrderControllerService.UserOrderControllerCreateOrderPath, 'post');
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
        return r as StrictHttpResponse<Order>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createOrder(params: {
    userId: string;
      body?: Order
  }): Observable<Order> {

    return this.createOrder$Response(params).pipe(
      map((r: StrictHttpResponse<Order>) => r.body as Order)
    );
  }

  /**
   * Path part for operation userOrderControllerDeleteOrders
   */
  static readonly UserOrderControllerDeleteOrdersPath = '/users/{userId}/orders';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteOrders$Response(params: {
    userId: string;
    where?: string;

  }): Observable<StrictHttpResponse<{ 'count'?: number }>> {

    const rb = new RequestBuilder(this.rootUrl, UserOrderControllerService.UserOrderControllerDeleteOrdersPath, 'delete');
    if (params) {

      rb.path('userId', params.userId);
      rb.query('where', params.where);

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'count'?: number }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteOrders(params: {
    userId: string;
    where?: string;

  }): Observable<{ 'count'?: number }> {

    return this.deleteOrders$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'count'?: number }>) => r.body as { 'count'?: number })
    );
  }

  /**
   * Path part for operation userOrderControllerPatchOrders
   */
  static readonly UserOrderControllerPatchOrdersPath = '/users/{userId}/orders';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `patchOrders()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  patchOrders$Response(params: {
    userId: string;
    where?: string;
      body?: {  }
  }): Observable<StrictHttpResponse<{ 'count'?: number }>> {

    const rb = new RequestBuilder(this.rootUrl, UserOrderControllerService.UserOrderControllerPatchOrdersPath, 'patch');
    if (params) {

      rb.path('userId', params.userId);
      rb.query('where', params.where);

      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'count'?: number }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `patchOrders$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  patchOrders(params: {
    userId: string;
    where?: string;
      body?: {  }
  }): Observable<{ 'count'?: number }> {

    return this.patchOrders$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'count'?: number }>) => r.body as { 'count'?: number })
    );
  }

}
