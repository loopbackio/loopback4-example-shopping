/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class PingControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation pingControllerPing
   */
  static readonly PingControllerPingPath = '/ping';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ping()` instead.
   *
   * This method doesn't expect any request body.
   */
  ping$Response(params?: {

  }): Observable<StrictHttpResponse<{ 'greeting'?: string, 'date'?: string, 'url'?: string, 'headers'?: { 'Content-Type'?: string } }>> {

    const rb = new RequestBuilder(this.rootUrl, PingControllerService.PingControllerPingPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{ 'greeting'?: string, 'date'?: string, 'url'?: string, 'headers'?: { 'Content-Type'?: string } }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `ping$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  ping(params?: {

  }): Observable<{ 'greeting'?: string, 'date'?: string, 'url'?: string, 'headers'?: { 'Content-Type'?: string } }> {

    return this.ping$Response(params).pipe(
      map((r: StrictHttpResponse<{ 'greeting'?: string, 'date'?: string, 'url'?: string, 'headers'?: { 'Content-Type'?: string } }>) => r.body as { 'greeting'?: string, 'date'?: string, 'url'?: string, 'headers'?: { 'Content-Type'?: string } })
    );
  }

}
