import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TestcomponentComponent } from './testcomponent/testcomponent.component';

@NgModule({
  declarations: [
    AppComponent,
    TestcomponentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule // ajout de HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }