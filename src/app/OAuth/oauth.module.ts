//Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Components
import { OAuthCallbackComponent } from './components/oauth-callback/oauth-callback.component';

@NgModule({
  declarations: [OAuthCallbackComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class OAuthModule {}
