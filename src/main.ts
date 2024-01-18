import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
declare const gapi: any;

// Load the 'auth2' library after the platform.js script is loaded
function handleClientLoad() {
  gapi.load('auth2', () => {
    gapi.auth2.init({
      client_id: '438341116528-9nq9917dvo6lod4dgqsf7st6p4q8ua5l.apps.googleusercontent.com', // Replace with your Google OAuth client ID
      scope: 'profile email',
    }).then(() => {
      platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));
    });
  });
}

document.addEventListener('DOMContentLoaded', handleClientLoad);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
