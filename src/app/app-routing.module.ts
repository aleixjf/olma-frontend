//Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { HomeComponent } from './Views/home/home.component';
import { LoginComponent } from './Auth/components/login/login.component';
import { ProfileComponent } from './User/components/profile/profile.component';
import { UserEditorComponent } from './User/components/user-editor/user-editor.component';
import { PasswordEditorComponent } from './User/components/password-editor/password-editor.component';
import { LibraryComponent } from './Library/components/library/library.component';
import { SmartlistEditorComponent } from './Library/components/smartlist-editor/smartlist-editor.component';
import { TrackEditorComponent } from './Library/components/track-editor/track-editor.component';
import { AboutComponent } from './Views/about/about.component';
import { TermsComponent } from './Views/terms/terms.component';
import { PrivacyComponent } from './Views/privacy/privacy.component';
import { OAuthCallbackComponent } from './OAuth/components/oauth-callback/oauth-callback.component';
import { PageNotFoundComponent } from './Views/page-not-found/page-not-found.component';

//Guards
import { AuthGuard } from './Shared/guards/auth.guard';
import { AdminGuard } from './Shared/guards/admin.guard';
import { LibraryGuard } from './Library/guards/library.guard';
import { SmartlistGuard } from './Library/guards/smartlist.guard';

const routes: Routes = [
  /*
  INFO: Paths will be attempted to matched in the order of this array.
  This means it should follow an order similar to this one, for a specific route:
  /path/new
  /path/:parameter
  /path/:parameter/edit
  /another-path
  */

  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: UserEditorComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/edit',
    component: UserEditorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/password',
    component: PasswordEditorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: ProfileComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'library',
    component: LibraryComponent,
    /*
    TO-DO: this doesn't update the paramMap... and the tracks aren't updated...
    children: [
      {
        path: 'playlists/:uuid',
        component: LibraryComponent,
      },
    ]
    */
  },
  {
    path: 'library/playlists/add',
    pathMatch: 'full',
    component: SmartlistEditorComponent,
  },
  {
    path: 'library/playlists/:uuid',
    component: LibraryComponent,
    canActivate: [LibraryGuard],
  },
  {
    path: 'library/playlists/:uuid/edit',
    component: SmartlistEditorComponent,
    canActivate: [SmartlistGuard],
  },
  {
    path: 'library/tracks/:uuid',
    component: TrackEditorComponent,
    canActivate: [LibraryGuard],
  },
  {
    path: 'auth/:platform',
    component: OAuthCallbackComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
