import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSliderModule } from 'ngx-slider-v2';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { DEFAULT_PSM_OPTIONS } from 'angular-password-strength-meter/zxcvbn';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSliderModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule.forRoot(DEFAULT_PSM_OPTIONS)
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
