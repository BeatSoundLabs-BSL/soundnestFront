import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {LanguageSwitcherComponent} from './public/components/language-switcher/language-switcher.component';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcherComponent, MatToolbarRow, MatToolbar, MatAnchor, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'soundnestFront';
}
