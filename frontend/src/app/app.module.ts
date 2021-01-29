import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeadlineCardComponent } from './home/headline-card/headline-card.component';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { LikesComponent } from './likes/likes.component';
import { PreferenceComponent } from './preference/preference.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const ROUTE: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'likes', component: LikesComponent, canActivate: [AuthGuard] },
  {
    path: 'preference',
    component: PreferenceComponent,
    canActivate: [AuthGuard],
  },
  { path: 'article/:articleId', component: ArticlePreviewComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeadlineCardComponent,
    ArticlePreviewComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    LikesComponent,
    PreferenceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTE, {useHash: true}),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
