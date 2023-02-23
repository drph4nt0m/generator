import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TotpComponent } from './totp/totp.component';
import { UsernameAndPasswordComponent } from './username-and-password/username-and-password.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService } from '@angular/fire/analytics';

@NgModule({
  declarations: [AppComponent, UsernameAndPasswordComponent, TotpComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSnackBarModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatSliderModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics())
  ],
  providers: [
    ScreenTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
