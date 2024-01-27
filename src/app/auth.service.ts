declare const gapi: any;
// google-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  private readonly clientId = '438341116528-9nq9917dvo6lod4dgqsf7st6p4q8ua5l.apps.googleusercontent.com';
  private readonly scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile';
  private readonly apiKey = 'AIzaSyCtsOnJ-mzHrnpoCAO9xos6ceuLX2k4RAY'
  private discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  initClient(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      gapi.load('client', {
        callback: () => {
          gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            discoveryDocs: this.discoveryDocs,
            scope: this.scope,
            ux_mode: 'popup',
            plugin_name: 'password-generator'
          }).then(
            () => resolve(),
            (error: any) => reject(error)
          );
        },
        onerror: (error: any) => reject(error),
        timeout: 10000,
        ontimeout: () => reject(new Error('Timed out loading gapi.client')),
      });
    });
  }
  signIn(): Promise<any> {
    return gapi.auth2.getAuthInstance().signIn().then((user: any) => {
      return user.getAuthResponse().id_token;
    });
  }

   signOut(): void {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
      sessionStorage.removeItem('loggedUser');
    });
   }
}
