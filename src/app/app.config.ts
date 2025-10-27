import { ApplicationConfig, provideZoneChangeDetection, mergeApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { mytheme } from './mytheme';
import { translationProviders } from './translation.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

Chart.register(ChartDataLabels);

const baseConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi() // ✅ บอกให้ HttpClient ดึง Interceptor จาก DI
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true  
    }
  ]
};


export const appConfig = mergeApplicationConfig(baseConfig, mytheme);



  