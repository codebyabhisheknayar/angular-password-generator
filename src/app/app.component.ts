import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { Storage } from '@google-cloud/storage';  // Import the Google Cloud Storage module
import { HttpClient } from '@angular/common/http';
declare var gapi: any;
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

  private storage = new Storage({
    keyFilename: './../assets/client_secret_438341116528-9nq9917dvo6lod4dgqsf7st6p4q8ua5l.apps.googleusercontent.com.json', // Replace with the path to your service account key file
    projectId: 'password-generator-411613', // Replace with your Google Cloud project ID
  });
  auth2: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Load Google API Client Library
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: 'your-client-id', // Replace with your Google OAuth client ID
        scope: 'profile email',
      }).then(() => {
        this.auth2 = gapi.auth2.getAuthInstance();
      });
    });
  }

  signInWithGoogle() {
    this.auth2.signIn().then(
      (googleUser: any) => this.onGoogleSignInSuccess(googleUser),
      (error: any) => this.onGoogleSignInFailure(error)
    );
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



  onGoogleSignInSuccess(googleUser: any) {
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());

    // Store generated password to Google Cloud Storage
    // const bucketName = 'your-bucket-name'; // Replace with your Google Cloud Storage bucket name
    // const fileName = 'generated-password.txt'; // Replace with the desired file name

    // const file = this.storage.bucket(bucketName).file(fileName);

    // file.save(this.password, (err) => {
    //   if (err) {
    //     console.error('Error saving password to Google Cloud Storage:', err);
    //   } else {
    //     console.log('Password saved to Google Cloud Storage successfully.');

    //     // Display a success message or perform additional actions
    //     alert('Password saved successfully!');
    //   }
    // });
  }

  onGoogleSignInFailure(error: any) {
    console.error('Google Sign-In failed:', error);
  }

}
