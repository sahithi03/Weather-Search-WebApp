import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule,MatCardModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForecastSearchComponent } from './forecast/forecast-search/forecast-search.component';
import { ForecastResultsComponent } from './forecast/forecast-results/forecast-results.component';
import { SearchService } from './forecast/search.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
//import { LoaderInterceptorService } from './forecast/loader/loader.interceptor';
import { FavoriteService } from './forecast/favorite.service';
import { FavoriteComponent } from './forecast/favorite/favorite.component';

@NgModule({
  declarations: [
    AppComponent,
    ForecastSearchComponent,
    ForecastResultsComponent,
    FavoriteComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ChartsModule,
    MatTooltipModule
  ],
  providers: [SearchService,FavoriteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
