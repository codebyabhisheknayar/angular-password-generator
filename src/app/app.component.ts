declare const gapi: any;

import { ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleApiService } from './auth.service';
import { ThemeService } from './services/theme.service';
import { ClipboardService } from 'ngx-clipboard';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') class = 'dark';
  @ViewChild('googleSignInBtn') googleSignInBtn!: ElementRef;
  @ViewChild('speakerModal') speakerModal!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;


  title = 'angular-password-generator';
  password = '';
  includeUppercaseLetters = true;
  includeLowercaseLetters = true;
  includeNumbers = true;
  includeSymbols = true;
  passwordStrengthLabel: string = '';
  sliderControl: FormControl = new FormControl(10);
  userName = '';
  passwordLabel = new FormControl('');

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
  clientiD = "438341116528-9nq9917dvo6lod4dgqsf7st6p4q8ua5l.apps.googleusercontent.com";

  currentTheme: string;
  savedSuccess: boolean = false;
  defaultImage = 'https://idea.urmia.ir/Content/images/user.png';
  folderName = 'PasswordGenerator';
  fileName = 'passwords.json';
  isViewPassword: boolean = false;
  viewSavedPassword: any;
  passwordList: any;
  isLoading: boolean = false;
  btnSubmitted: boolean = false;
  isBtnSubmitted: boolean = false;
  showErrorMessage: boolean = false;
  showPasswordCopyMsg: boolean = false;
  encryptionKey: string = 'de8c4f2e5a2654fc5d9b4e82aea6b0c1e835d023935473acc40a7e9891947776';
  // key: string = this.generateEncryptionKey(32);

  constructor(private cdr: ChangeDetectorRef, public themeService: ThemeService, private http: HttpClient, private _clipboardService: ClipboardService, public googleApiService: GoogleApiService,) {
    this.currentTheme = themeService.getTheme();
  }

  ngOnInit(): void {

    this.themeService.applyStoredTheme();

    this.googleApiService.initClient().then(() => {
      if (this.googleSignInBtn) {
        this.renderGoogleSignInButton();
      }
    }).catch((error) => {
      console.error('Error initializing Google Drive API client', error);
    });

    this._clipboardService.copyResponse$.subscribe(re => {
      if (re.isSuccess) {
        this.showPasswordCopyMsg = true;
        setTimeout(() => {
          this.showPasswordCopyMsg = false;
        }, 3500);
      }
    });

    const storedCredentials = sessionStorage.getItem("loggedUser");
    if (storedCredentials) {
      this.isLoggedIn = true;
      this.userName = JSON.parse(sessionStorage.getItem("loggedUser")!).name;
      this.profilePic = JSON.parse(sessionStorage.getItem("loggedUser")!).picture;
    }
  }
  private decodeToken(token: string): any {
    try {
      if (typeof token === 'string') {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.email) {
          return payload;
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  private renderGoogleSignInButton(): void {
    gapi.signin2.render(this.googleSignInBtn.nativeElement, {
      'scope': 'email profile',
      'width': 265,
      'height': 40,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.onGoogleSignInSuccess.bind(this),
      'onfailure': this.onGoogleSignInFailure.bind(this)
    });
  }

  private onGoogleSignInSuccess(googleUser: any): void {
    const idToken = googleUser.getAuthResponse().id_token;
    const payload = this.decodeToken(idToken);
    sessionStorage.setItem('loggedUser', JSON.stringify(payload));
    this.isLoggedIn = true;
    this.userName = payload.name;
    this.profilePic = payload.picture;
    this.googleSignInBtn.nativeElement.style.display = 'none';
    this.getFile();
    this.cdr.detectChanges();
  }

  onGoogleSignInFailure(error: any): void {
    // Handle the sign-in failure

  }

  handleLogout(): void {
    this.googleApiService.signOut();
    this.isLoggedIn = false;
    this.cdr.detectChanges();
    location.reload();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getTheme();
    this.cdr.detectChanges();
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


    this.password = generatedPassword.join('');

  }

  savePasswordToDrive(): Promise<any> {
    const password = this.password;
    this.isBtnSubmitted = true;
    if (!password) {
      console.error('Password is empty or undefined.');
      this.showErrorMessage = true;
      setTimeout(() => {
        this.showErrorMessage = false;
      }, 5000);
      return Promise.reject('Password is empty or undefined.');
    }
    const folderName = this.folderName;
    const fileName = this.fileName;
    return gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    }).then((response: any) => {
      const folders = response.result.files;

      if (folders && folders.length > 0) {
        const folderId = folders[0].id;
        return this.checkAndCreateFile(fileName, folderId, password);
      } else {
        return this.createFolder(folderName).then((newFolderId: string) => {
          return this.checkAndCreateFile(fileName, newFolderId, password).then(() => {
            this.isBtnSubmitted = false;
          });
        }).catch(error => {
          console.error('Error creating folder:', error);
          return Promise.reject('Error creating folder.');
        });
      }
    });
  }

  private checkAndCreateFile(fileName: string, folderId: string, password: string): Promise<any> {
    return gapi.client.drive.files.list({
      q: `name='${fileName}' and mimeType='application/json' and '${folderId}' in parents`,
      fields: 'files(id, name)',
    }).then((filesResponse: any) => {
      const files = filesResponse.result.files;

      if (files && files.length > 0) {
        const fileId = files[0].id;
        return this.getFileContent(fileId).then((content: string) => {
          const passwords = JSON.parse(content || '[]');
          const newPasswordEntry = {
            id: this.generateUniqueId(),
            label: this.passwordLabel.value,
            password: password,
            timestamp: new Date().toISOString(),
          };
          passwords.push(newPasswordEntry);
          const encryptedContent = this.encrypt(JSON.stringify(passwords, null, 2));
          return this.updateFileContent(fileId, encryptedContent).then(() => {
            this.savedSuccess = true;
            console.log(this.savedSuccess);
            this.passwordLabel.reset();
            this.cdr.detectChanges();
          });
        });
      } else {
        const initialPasswords = [{
          id: this.generateUniqueId(),
          label: this.passwordLabel.value,
          password: password,
          timestamp: new Date().toISOString(),
        }];
        const encryptedContent = this.encrypt(JSON.stringify(initialPasswords, null, 2));
        return this.createPasswordFile(fileName, folderId, encryptedContent, 'application/json').then(() => {
          this.savedSuccess = true;
          this.passwordLabel.reset();
          this.cdr.detectChanges();
        });
      }
    });
  }

  private createFolder(folderName: string): Promise<string> {
    return gapi.client.drive.files.create({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }).then((folderResponse: any) => {
      console.log(`Folder "${folderName}" created successfully.`);
      return folderResponse.result.id;
    }).catch((error: any) => {
      console.error('Error creating folder:', error);
      return Promise.reject('Error creating folder.');
    });
  }


  private getFileContent(fileId: string): Promise<string> {
    return gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    }).then((response: any) => {
      return response.body;
    });
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
  }

  private createPasswordFile(fileName: string, folderId: string, content: string, mimeType: string): Promise<any> {
    return gapi.client.drive.files.create({
      name: fileName,
      mimeType: mimeType,
      parents: [folderId],
      body: content,
    });
  }

  private updateFileContent(fileId: string, content: string): Promise<any> {
    return gapi.client.request({
      path: `/upload/drive/v3/files/${fileId}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      body: content,
    });
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

  async showModal(value: any): Promise<void> {
    try {
      this.btnSubmitted = true;

      if (value === 'save') {
        const password = this.password;

        if (!password) {
          this.showErrorMessage = true;
          setTimeout(() => {
            this.showErrorMessage = false;
          }, 5000);

          return Promise.resolve();
        }

        this.speakerModal.nativeElement.open = !this.speakerModal.nativeElement.open;
      }

      if (value === 'view') {
        this.isLoading = true;
        this.isViewPassword = true;
        this.savedSuccess = false;
        this.speakerModal.nativeElement.open = true;

        await this.getFile();

        this.passwordList = this.viewSavedPassword;
        console.log('password', this.passwordList);
      }

      return Promise.resolve();
    } catch (error) {
      console.error('An error occurred:', error);
      return Promise.reject(error);
    } finally {
      this.isLoading = false;
    }
  }



  onError(): void {
    this.profilePic = this.defaultImage;
  }

  getFile() {
    const folderName = this.folderName;
    const fileName = this.fileName;
    return gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    }).then((response: any) => {
      const folders = response.result.files;

      if (folders && folders.length > 0) {
        const folderId = folders[0].id;
        return this.getFolder(fileName, folderId);
      } else {

        console.error(`Folder not found: ${folderName}`);
        return Promise.reject(`Folder not found: ${folderName}`);
      }
    });

  }

  private getFolder(fileName: string, folderId: string): Promise<any> {
    return gapi.client.drive.files.list({
      q: `name='${fileName}' and mimeType='application/json' and '${folderId}' in parents`,
      fields: 'files(id, name)',
    }).then((filesResponse: any) => {
      const files = filesResponse.result.files;

      if (files && files.length > 0) {
        const fileId = files[0].id;
        return this.getFileContent(fileId).then((content: string) => {
          const decryptedContent = this.decrypt(content);
          const savedPassword = JSON.parse(decryptedContent || '[]');
          this.viewSavedPassword = savedPassword;
        });
      }
      else {
        console.error(`File not found: ${fileName}`);
        return Promise.reject(`File not found: ${fileName}`);
      }
    })
  }

  closeModal() {
    this.speakerModal.nativeElement.open = false;
    this.savedSuccess = false;
    this.btnSubmitted = false;
  }

  private encrypt(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey);
    return encrypted.toString();
  }

  private decrypt(data: string): string {
    const decrypted = CryptoJS.AES.decrypt(data, this.encryptionKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  generateEncryptionKey(length: any) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
  }

}


