import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Options } from 'ngx-slider-v2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') class = 'dark';

  title = 'angular-password-generator';
  password = '';
  includeUppercaseLetters = true;
  includeLowercaseLetters = true;
  includeNumbers = true;
  includeSymbols = true;
  passwordStrengthLabel: string = '';
  sliderControl: FormControl = new FormControl(10);

  options: Options = {
    floor: 1,
    ceil: 50,
    hidePointerLabels: true,
    hideLimitLabels: true,
    showSelectionBar: true
  };

  isDarkTheme = false;
  score: number | null = null;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
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

  logSliderValue(event: any) {
    // console.log('Slider Value:', event);
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

    if (availableCharacters === '') {
      availableCharacters = lowerCaseLetters + upperCaseLetters + numbers + symbols;
    }

    const availableCharactersArray = availableCharacters.split('');

    const generatedPassword = [];

    // Generate password
    for (let i = 0; i < this.sliderControl.value; i += 1) {
      const maxValue = availableCharactersArray.length;
      const randomValue = Math.floor(Math.random() * maxValue);
      generatedPassword.push(availableCharactersArray[randomValue]);
    }


    this.password = generatedPassword.join('')
  }


  public onPasswordStrengthChange(score: number | null) {
    if (score !== null) {
      switch (Math.round(score)) {
        case 0:
          this.passwordStrengthLabel = 'Very Weak';
          break;
        case 1:
        case 2:
          this.passwordStrengthLabel = 'Weak';
          break;

        case 3:
          this.passwordStrengthLabel = 'Medium';
          break;
        case 4:
          this.passwordStrengthLabel = 'Strong';
          break;
        default:
          this.passwordStrengthLabel = '';
      }
    } else {
      this.passwordStrengthLabel = '';
    }
  }


}
