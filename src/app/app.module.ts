//Angular
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';

//NgRX
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

//App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appReducers, EffectsArray } from './app.reducers';
import { environment } from 'src/environments/environment';

//Modules + Components
import { AuthModule } from './Auth/auth.module';
import { OAuthModule } from './OAuth/oauth.module';
import { UserModule } from './User/user.module';
import { LibraryModule } from './Library/library.module';
import { SpotifyModule } from './Spotify/spotify.module';

import { HeaderComponent } from './Views/header/header.component';
import { FooterComponent } from './Views/footer/footer.component';
import { FooterIconsComponent } from './Views/footer/footer-icons/footer-icons.component';
import { HomeComponent } from './Views/home/home.component';
import { AboutComponent } from './Views/about/about.component';
import { TermsComponent } from './Views/terms/terms.component';
import { PrivacyComponent } from './Views/privacy/privacy.component';
import { PageNotFoundComponent } from './Views/page-not-found/page-not-found.component';
import { SnackbarComponent } from './Views/snackbar/snackbar.component';

//Interceptors
import { OlmaInterceptorService } from './Auth/interceptor/olma.interceptor';
import { DropboxInterceptorService } from './Dropbox/interceptor/dropbox.interceptor';
import { OneDriveInterceptorService } from './OneDrive/interceptor/onedrive.interceptor';
import { SpotifyInterceptorService } from './Spotify/interceptor/spotify.interceptor';

//Pipes
import { FormatDatePipe } from './Shared/pipes/format-date.pipe';

@NgModule({
  declarations: [
    //Components
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FooterIconsComponent,
    HomeComponent,
    AboutComponent,
    TermsComponent,
    PrivacyComponent,
    PageNotFoundComponent,
    //Pipes
    FormatDatePipe,
    SnackbarComponent,
  ],
  imports: [
    //Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    //Angular MaterialModules
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    //User-defined modules
    AuthModule,
    OAuthModule,
    SpotifyModule,
    UserModule,
    LibraryModule,
    //NgRX Modules
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(EffectsArray),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OlmaInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DropboxInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OneDriveInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpotifyInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
