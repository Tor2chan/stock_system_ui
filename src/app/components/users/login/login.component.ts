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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ImageModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    private authService: AuthService,
    private messageService: MessageService,
  ) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translateService.setDefaultLang(savedLang);
    this.translateService.use(savedLang);
  }

  login() {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
      });
      this.isLoading = false;
      return;
    }

    this.http
      .post<any>('http://stock-system-1-s8be.onrender.com/stock-api/auth/login', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.authService.setToken(res.access_token);
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('role', res.role);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'เข้าสู่ระบบสำเร็จ',
          });

          setTimeout(() => {
            this.router.navigate(['/stock-main-search']);
          }, 1000);

          this.isLoading = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          });

          this.isLoading = false;
        },
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
