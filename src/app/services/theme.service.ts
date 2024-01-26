import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'appTheme';
  private readonly BODY_CLASS = 'dark-theme';

  getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'dark';
  }

  applyStoredTheme() {
    const storedTheme = this.getTheme();
    document.documentElement.setAttribute('data-theme', storedTheme);
    this.toggleBodyClass(storedTheme);
  }

  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme);
    this.toggleBodyClass(newTheme);
  }

  private toggleBodyClass(theme: string) {
    // Remove existing theme class
    document.body.classList.remove(this.BODY_CLASS);

    // Add new theme class if it's dark
    if (theme === 'light') {
      document.body.classList.add(this.BODY_CLASS);
    }
  }
}
