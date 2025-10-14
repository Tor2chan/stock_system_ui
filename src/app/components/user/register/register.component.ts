import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    RouterLink,
    ButtonModule,
    CardModule,
    MessageModule,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService
        
      ) {
        const savedLang = localStorage.getItem('language') || 'en';
        this.translateService.setDefaultLang(savedLang);
        this.translateService.use(savedLang);}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator // ใช้ฟังก์ชันนี้ในการตรวจสอบรหัสผ่าน
    });
  }

  // ฟังก์ชันตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกันหรือไม่
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null; // เคลียร์ข้อความ error ก่อน submit ใหม่
    this.successMessage = null;

    if (this.registerForm.valid) {
      console.log('Form Submitted!', this.registerForm.value);
      // **ส่วนนี้คือ Logic การส่งข้อมูลไปยัง API**
      // เช่น: this.authService.register(this.registerForm.value).subscribe(...)
      
      this.successMessage = 'การลงทะเบียนเสร็จสมบูรณ์! กรุณาเข้าสู่ระบบ';
      // ตัวอย่างการนำทาง:
      // setTimeout(() => this.router.navigate(['/login']), 2000);

    } else {
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      // เพื่อให้แสดง error message ในฟอร์ม
      this.registerForm.markAllAsTouched(); 
    }
  }

  // Getter functions สำหรับเรียกใช้ใน HTML เพื่อความสะดวก
  get f() { return this.registerForm.controls; }

  toggleLanguage() {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'en' ? 'th' : 'en';

    localStorage.setItem('language', newLang);
    window.location.reload();
  }
}