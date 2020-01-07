import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChartContainerComponent} from './chartcontainer/chart-container.component';
import {RadarChartComponent} from './radar-chart/radar-chart.component';
import {FilterComponent} from './filter/filter.component';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './services/data.service';
import {DxBoxModule, DxButtonModule, DxCheckBoxModule, DxPolarChartModule, DxPopupModule, DxSliderModule} from 'devextreme-angular';
import {ApiService} from './services/api.service';
import {RatingComponent} from './rating/rating.component';
import {TrendPositioningService} from './services/trend-positioning.service';
import { TrendInfoComponent } from './trendinfo/trend-info.component';


@NgModule({
  declarations: [
    AppComponent,
    ChartContainerComponent,
    RadarChartComponent,
    FilterComponent,
    HomeComponent,
    RatingComponent,
    TrendInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DxPolarChartModule,
    DxCheckBoxModule,
    DxButtonModule,
    DxPopupModule,
    DxSliderModule,
    DxBoxModule
  ],
  providers: [
    DataService,
    ApiService,
    TrendPositioningService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

