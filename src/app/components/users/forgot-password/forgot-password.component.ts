import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImageModule } from 'primeng/image';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    CardModule,
    MessageModule,
    TranslateModule,
    ImageModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService

  ) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translateService.setDefaultLang(savedLang);
    this.translateService.use(savedLang);
  }


  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.forgotPasswordForm.valid) {
      console.log('Sending password reset link to:', this.forgotPasswordForm.value.email);

      // *** จำลอง Logic การส่งอีเมลรีเซ็ต ***
      this.successMessage = 'เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว (หากมีอยู่ในระบบ)';

      // ตัวอย่าง: หลังจาก 5 วินาที ให้กลับไปหน้า Login
      setTimeout(() => this.router.navigate(['/login']), 5000);

    } else {
      this.errorMessage = 'กรุณากรอกอีเมลให้ถูกต้อง';
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  // Getter functions สำหรับเรียกใช้ใน HTML เพื่อความสะดวก
  get f() { return this.forgotPasswordForm.controls; }

  toggleLanguage() {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'en' ? 'th' : 'en';

    localStorage.setItem('language', newLang);
    window.location.reload();
  }
}
