/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { NewUser } from '../models/new-user';
import { Product } from '../models/product';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation userControllerLogin
   */
  static readonly UserControllerLoginPath = '/users/login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login$Response(params: {
  
    /**
     * The input of login function
     */
    body: { 'email': string, 'password': string }
  }): Observable<StrictHttpResponse<{ 'token'?: string }>> {

    const rb = new RequestBuilder(this.rootUrl, UserControllerService.UserControllerLoginPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'token'?: string }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `login$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login(params: {
  
    /**
     * The input of login function
     */
    body: { 'email': string, 'password': string }
  }): Observable<{ 'token'?: string }> {

    return this.login$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'token'?: string }>) => r.body as { 'token'?: string })
    );
  }

  /**
   * Path part for operation userControllerPrintCurrentUser
   */
  static readonly UserControllerPrintCurrentUserPath = '/users/me';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `printCurrentUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  printCurrentUser$Response(params?: {

  }): Observable<StrictHttpResponse<{ 'id': string, 'email'?: string, 'name'?: string }>> {

    const rb = new RequestBuilder(this.rootUrl, UserControllerService.UserControllerPrintCurrentUserPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'id': string, 'email'?: string, 'name'?: string }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `printCurrentUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  printCurrentUser(params?: {

  }): Observable<{ 'id': string, 'email'?: string, 'name'?: string }> {

    return this.printCurrentUser$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'id': string, 'email'?: string, 'name'?: string }>) => r.body as { 'id': string, 'email'?: string, 'name'?: string })
    );
  }

  /**
   * Path part for operation userControllerProductRecommendations
   */
  static readonly UserControllerProductRecommendationsPath = '/users/{userId}/recommend';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `productRecommendations()` instead.
   *
   * This method doesn't expect any request body.
   */
  productRecommendations$Response(params: {
    userId: string;

  }): Observable<StrictHttpResponse<Array<Product>>> {

    const rb = new RequestBuilder(this.rootUrl, UserControllerService.UserControllerProductRecommendationsPath, 'get');
    if (params) {

      rb.path('userId', params.userId);

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Product>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `productRecommendations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  productRecommendations(params: {
    userId: string;

  }): Observable<Array<Product>> {

    return this.productRecommendations$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Product>>) => r.body as Array<Product>)
    );
  }

  /**
   * Path part for operation userControllerFindById
   */
  static readonly UserControllerFindByIdPath = '/users/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById$Response(params: {
    userId: string;

  }): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, UserControllerService.UserControllerFindByIdPath, 'get');
    if (params) {

      rb.path('userId', params.userId);

    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById(params: {
    userId: string;

  }): Observable<User> {

    return this.findById$Response(params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  /**
   * Path part for operation userControllerSet
   */
  static readonly UserControllerSetPath = '/users/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `set()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  set$Response(params: {
    userId: string;
  
    /**
     * update user
     */
    body?: User
  }): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, UserControllerService.UserControllerSetPath, 'put');
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
        return r as StrictHttpResponse<User>;
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
     * update user
     */
    body?: User
  }): Observable<User> {

    return this.set$Response(params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

  /**
   * Path part for operation userControllerCreate
   */
  static readonly UserControllerCreatePath = '/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create$Response(params?: {
      body?: NewUser
  }): Observable<StrictHttpResponse<User>> {

    const rb = new RequestBuilder(this.rootUrl, UserControllerService.UserControllerCreatePath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<User>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `create$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create(params?: {
      body?: NewUser
  }): Observable<User> {

    return this.create$Response(params).pipe(
      map((r: StrictHttpResponse<User>) => r.body as User)
    );
  }

}
