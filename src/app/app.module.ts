import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { BaseUrlInterceptor } from './interceptors/baseurl';
import { TripAddComponent } from './trips/trip-add/trip-add.component';
import { JWTInterceptor } from './interceptors/jwt';
import { AuthService } from './auth/auth.service';
import { TripsListComponent } from './trips/trips-list/trips-list.component';
import { TripService } from './trips/trip.service';
import { MapUtilsService } from './trips/map-utils.service';
import { MapComponent } from './trips/map/map.component';
import { FormatDistancePipe, SumProgressPipe } from './pipes';
import { MessagesService } from './services/messages.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TripAddComponent,
    MapComponent,
    TripsListComponent,
    FormatDistancePipe,
    SumProgressPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
      libraries: ['places', 'geometry']
    })
  ],
  providers: [
    AuthService,
    TripService,
    MapUtilsService,
    GoogleMapsAPIWrapper,
    MessagesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
