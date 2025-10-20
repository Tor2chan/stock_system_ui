import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MODE_PAGE } from '../../../../modules/common/common';


@Component({
  selector: 'app-add-user',
  imports: [FormsModule, CardModule, CommonModule, InputTextModule, DropdownModule, InputNumberModule, ButtonModule, ToastModule, TranslateModule, InputSwitchModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  stock = {
    name: '',
    username: '',
    password: '',
    role: '',
    status: true // ใช้ boolean สำหรับ p-inputSwitch
  };

  mode: MODE_PAGE;

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {
    this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'create';
  }




  onSubmit() {
    if (this.stock.name && this.stock.username && this.stock.password && this.stock.role) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User added successfully'
      });
      setTimeout(() => {
        this.router.navigate(['/edit-user']);
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill out all required fields'
      });
    }
  }

  onCancel() {
    this.router.navigate(['/edit-user']);
  }
}
