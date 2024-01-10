import { Component } from '@angular/core';
import { Options } from 'ngx-slider-v2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-password-generator';
  password = '';
  passwordLength = 10;
  includeUppercaseLetters = false;
  includeLowercaseLetters = false;
  includeNumbers = false;
  includeSymbols = false;

  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  };

  onChangeUseUppercaseLetters() {
    this.includeUppercaseLetters = !this.includeUppercaseLetters
  }

  onChangeUseLowercaseLetters() {
    this.includeLowercaseLetters = !this.includeLowercaseLetters
  }

  onChangeUseNumbers() {
    this.includeNumbers = !this.includeNumbers
  }
  onChangeUseSymbols() {
    this.includeSymbols = !this.includeSymbols
  }

  generatePassword() {
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_-,.';

    let availableCharacters = '';

    if (this.includeUppercaseLetters) {
      availableCharacters += upperCaseLetters
    }

    if (this.includeLowercaseLetters) {
      availableCharacters += lowerCaseLetters
    }

    if (this.includeNumbers) {
      availableCharacters += numbers
    }

    if (this.includeSymbols) {
      availableCharacters += symbols
    }

    availableCharacters.split('');

    const generatedPassword = [];

    for (let i = 0; i < this.passwordLength; i += 1) {
      const max = availableCharacters.length
      const ran = Math.random()
      const idx = Math.floor(ran * (max + 1))

      generatedPassword.push(availableCharacters[idx])
    }

    this.password = generatedPassword.join('')
  }
}
