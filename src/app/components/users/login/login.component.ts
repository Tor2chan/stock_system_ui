import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageModule } from 'primeng/image';
import { AuthService } from '../../../services/auth.service';
import { JwtInterceptor } from '../../../interceptors/jwt.interceptor';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    TranslateModule,
    ImageModule

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }]
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private http: HttpClient,
     private authService: AuthService
  ) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translateService.setDefaultLang(savedLang);
    this.translateService.use(savedLang);
  }

  login() {
    this.http.post<any>('http://localhost:8080/stock-api/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: res => {  
        this.authService.setToken(res.access_token);
        this.router.navigate(['/stock-main-search'])
        console.log('Login success, token saved!');
      },
      error: err => console.error('Login failed', err)
    });
  }

  onCheck() {
    this.errorMessage = '';

    if (!this.username) {
      this.errorMessage = 'กรุณากรอกชื่อผู้ใช้';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'กรุณากรอกรหัสผ่าน';
      return;
    }
  }

 

  toggleLanguage() {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'en' ? 'th' : 'en';

    localStorage.setItem('language', newLang);
    window.location.reload();
  }


}
