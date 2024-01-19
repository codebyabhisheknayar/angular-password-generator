import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

declare var google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @HostBinding('class') class = 'dark';
  @ViewChild('googleSignInBtn') googleSignInBtn!: ElementRef;

  title = 'angular-password-generator';
  password = '';
  includeUppercaseLetters = true;
  includeLowercaseLetters = true;
  includeNumbers = true;
  includeSymbols = true;
  passwordStrengthLabel: string = '';
  sliderControl: FormControl = new FormControl(10);
  userName= '' ;

  options: Options = {
    floor: 1,
    ceil: 50,
    hidePointerLabels: true,
    hideLimitLabels: true,
    showSelectionBar: true
  };

  isDarkTheme = false;
  score: number | null = null;
  isLoggedIn: boolean = false;
  profilePic: any;

  constructor(private http: HttpClient, private router: Router, public auth: AuthService,) { }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '438341116528-9nq9917dvo6lod4dgqsf7st6p4q8ua5l.apps.googleusercontent.com',
      callback: (resp: any) => this.handleLogin(resp)
    });
    setTimeout(() => {
      if (this.googleSignInBtn) {
        google.accounts.id.renderButton(this.googleSignInBtn.nativeElement, {
          theme: 'filled_blue',
          size: 'large',
          shape: 'rectangle',
          width: 260
        })
      }
    }, 0);


    const storedCredentials = sessionStorage.getItem("loggedUser");
    if (storedCredentials) {
      this.isLoggedIn = true;
      this.userName = JSON.parse(sessionStorage.getItem("loggedUser")!).name;
      this.profilePic = JSON.parse(sessionStorage.getItem("loggedUser")!).picture;
    }
  }



  private decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]))
  }
  handleLogin(response: any) {
    console.log('work');
    if (response) {
      const payLoad = this.decodeToken(response.credential);
      sessionStorage.setItem("loggedUser", JSON.stringify(payLoad));
      this.isLoggedIn = true;
      console.log('work', this.isLoggedIn);
      window.location.reload();
    }
  }

  // Function to handle logout
  handleLogout() {
    this.auth.handleLogout();
    this.isLoggedIn = false;
    window.location.reload();
    // Additional logic or navigation for logout
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
  onChangeUseUppercaseLetters() {
    console.log(this.includeUppercaseLetters);
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
    console.log('Slider Value:', event);
    // const desiredCheckboxCount = this.sliderControl.value;
    // // Update checkbox states based on the slider value
    // if (desiredCheckboxCount >= 1 && !this.includeUppercaseLetters) {
    //   this.includeUppercaseLetters = true;
    // } else if (desiredCheckboxCount < 1 && this.includeUppercaseLetters) {
    //   this.includeUppercaseLetters = false;
    // }

    // if (desiredCheckboxCount >= 2 && !this.includeLowercaseLetters) {
    //   this.includeLowercaseLetters = true;
    // } else if (desiredCheckboxCount < 2 && this.includeLowercaseLetters) {
    //   this.includeLowercaseLetters = false;
    // }

    // if (desiredCheckboxCount >= 3 && !this.includeNumbers) {
    //   this.includeNumbers = true;
    // } else if (desiredCheckboxCount < 3 && this.includeNumbers) {
    //   this.includeNumbers = false;
    // }

    // if (desiredCheckboxCount >= 4 && !this.includeSymbols) {
    //   this.includeSymbols = true;
    // } else if (desiredCheckboxCount < 4 && this.includeSymbols) {
    //   this.includeSymbols = false;
    // }
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
    console.log(score);
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
