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
  private readonly redirectUri = 'http://localhost:4200';
  private readonly scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile';
  private readonly authEndpoint = 'https://accounts.google.com/o/oauth2/auth';
  private readonly tokenEndpoint = 'https://accounts.google.com/o/oauth2/token';
  private readonly apiUrl = 'https://www.googleapis.com/drive/v3';
  private readonly apiKey = 'AIzaSyCtsOnJ-mzHrnpoCAO9xos6ceuLX2k4RAY'
  private discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

  private accessToken: string = "";

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);


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
        timeout: 10000, // Set a timeout in case of loading issues
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

  // savePasswordToDrive(password: string): Promise<any> {
  //   const folderName = 'PasswordGenerator'; // Replace with your desired folder name

  //   return gapi.client.drive.files.list({
  //     q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
  //     fields: 'files(id, name)',
  //   }).then((response: any) => {
  //     const folders = response.result.files;

  //     if (folders && folders.length > 0) {
  //       // Folder exists, use the first one
  //       const folderId = folders[0].id;
  //       return this.createOrUpdatePasswordFile(password, folderId);
  //     } else {
  //       // Folder doesn't exist, create a new one
  //       return this.createPasswordFolder(folderName).then((newFolderId: string) => {
  //         return this.createOrUpdatePasswordFile(password, newFolderId);
  //       });
  //     }
  //   });
  // }

  // private createOrUpdatePasswordFile(password: string, folderId: string): Promise<any> {
  //   const fileName = 'generated_password.txt'; // Replace with your desired file name

  //   return gapi.client.drive.files.list({
  //     q: `name='${fileName}' and '${folderId}' in parents and mimeType='text/plain'`,
  //     fields: 'files(id, name)',
  //   }).then((response: any) => {
  //     const files = response.result.files;

  //     if (files && files.length > 0) {
  //       // File exists, update its content
  //       const fileId = files[0].id;
  //       return this.updateFileContent(fileId, password);
  //     } else {
  //       // File doesn't exist, create a new one
  //       return this.createPasswordFile(fileName, folderId, password);
  //     }
  //   });
  // }

  // private createPasswordFolder(folderName: string): Promise<string> {
  //   return gapi.client.drive.files.create({
  //     name: folderName,
  //     mimeType: 'application/vnd.google-apps.folder',
  //   }).then((response: any) => {
  //     return response.result.id;
  //   });
  // }

  // private createPasswordFile(fileName: string, folderId: string, content: string): Promise<any> {
  //   return gapi.client.drive.files.create({
  //     name: fileName,
  //     mimeType: 'text/plain',
  //     parents: [folderId],
  //     body: content,
  //   });
  // }

  // private updateFileContent(fileId: string, content: string): Promise<any> {
  //   return gapi.client.request({
  //     path: `/upload/drive/v3/files/${fileId}`,
  //     method: 'PATCH',
  //     params: { uploadType: 'media' },
  //     body: content,
  //   });
  // }

}
