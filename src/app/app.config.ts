import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MARKED_OPTIONS, provideMarkdown } from 'ngx-markdown';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { zh_CN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(),
    provideMarkdown({ 
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
          // breaks: true,
          pedantic: false,
        },
      },
    }),
    provideNzI18n(zh_CN),
  ]
};
