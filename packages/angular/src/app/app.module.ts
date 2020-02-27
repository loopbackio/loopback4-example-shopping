import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { Configuration as ApiConfiguration, ApiModule } from './shared/sdk';

export function apiConfigurationFactory(): ApiConfiguration {
  return new ApiConfiguration({
    basePath: environment.apiBaseUrl,
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    ApiModule.forRoot(apiConfigurationFactory),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
