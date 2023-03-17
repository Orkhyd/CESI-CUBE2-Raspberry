import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppComponent } from './app.component';
import { TestcomponentComponent } from './testcomponent/testcomponent.component';
import { GraphComponentComponent } from './graph-component/graph-component.component';

@NgModule({
  declarations: [
    AppComponent,
    TestcomponentComponent,
    GraphComponentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // ajout de HttpClientModule
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }