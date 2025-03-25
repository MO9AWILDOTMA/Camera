import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

// Guards and Interceptors
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { RoleInterceptor } from './core/interceptors/role.interceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { ModeratorGuard } from './core/guards/moderator.guard';

// Store
import { appReducers } from './core/store/reducers/app.reducer';
import { storeConfig } from './core/store/store.config';
import { AuthEffects } from './core/store/effects/auth.effect';
import { MovieEffects } from './core/store/effects/movie.effect';
import { ShowtimeEffects } from './core/store/effects/showtime.effect';
import { ReservationEffects } from './core/store/effects/reservation.effect';
import { UserEffects } from './core/store/effects/user.effect';
import { RoleEffects } from './core/store/effects/role.effect';
import { DiscountEffects } from './core/store/effects/discount.effect';
import { PaymentEffects } from './core/store/effects/payment.effect';
import { ScreeningRoomEffects } from './core/store/effects/screening-room.effect'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    // NgRx Store Configuration
    StoreModule.forRoot(appReducers, storeConfig),
    EffectsModule.forRoot([
      AuthEffects,
      MovieEffects,
      ShowtimeEffects,
      ReservationEffects,
      UserEffects,
      RoleEffects,
      DiscountEffects,
      PaymentEffects,
      ScreeningRoomEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      // logOnly: environment.production,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RoleInterceptor,
      multi: true
    },
    AuthGuard,
    AdminGuard,
    ModeratorGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
