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

  constructor(private translate: TranslateService, authService: AuthService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }
}
