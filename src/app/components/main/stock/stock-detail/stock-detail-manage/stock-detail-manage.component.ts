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
import { MODE_PAGE } from '../../../../../modules/common/common';
import { CommonModule } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
@Component({
  selector: 'app-stock-detail-manage',
  imports: [ FormsModule, CardModule,CommonModule, InputTextModule, DropdownModule, InputNumberModule, DatePicker, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './stock-detail-manage.component.html',
  styleUrl: './stock-detail-manage.component.scss'
})
export class StockDetailManageComponent {
  stock = {
    name: '',
    code: '',
    amount: 0,
    category: '',
    price: 0,
    date: null,
  
    expire: null
  };
  mode: MODE_PAGE;
  categories = ['Food', 'Drink', 'Medicine', 'Cosmetic'];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {  this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';}

  onSubmit() {
    if (this.stock.name && this.stock.code && this.stock.category) {

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Stock added successfully'
      });

      setTimeout(() => {
        this.router.navigate(['/stock-main-search']);
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill out all required fields'
      });
    }
  }
ngOnInit() {
      console.log('mode:', this.mode)
    }
  onCancel() {
    this.router.navigate(['/stock-main-search']);
  }
}

