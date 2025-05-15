import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthService} from './soundnest/services/user-auth.service';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatAnchor,
    RouterLink,
    LanguageSwitcherComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sound-nest';
  /**
   * Navigation options for the main menu.
   * Each option contains a route link and a translation label key.
   */
  options = [
    {link: '/ownerDashboard', label: 'ownerDashboard'},
    {link: '/reservations', label: 'reservations'},
    {link: '/calendar', label: 'calendar'},
    {link: '/room-list', label: 'rooms'},
    {link: '/alerts', label: 'alerts'},
    {link: '/history', label: 'history'},
    {link: '/settings', label: 'settings'},
  ]

  /**
   * Creates an instance of AppComponent.
   * Initializes the translation service with English as the default language.
   *
   * @param translate - The translation service for handling internationalization
   */
  constructor(private translate: TranslateService, authService: AuthService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
