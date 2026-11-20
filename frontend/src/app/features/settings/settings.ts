import { Component } from '@angular/core';
import { LOCALES, Locale, locale, setLocale, t } from '../../core/i18n';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-settings',
  imports: [PageHeader],
  templateUrl: './settings.html'
})
export class SettingsPage {
  protected readonly t = t;
  protected readonly locales = LOCALES;
  protected readonly currentLocale = locale;

  protected selectLocale(code: Locale): void {
    setLocale(code);
  }
}
