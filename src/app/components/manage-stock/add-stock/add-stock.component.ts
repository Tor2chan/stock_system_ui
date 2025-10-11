import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  providers: [MessageService,],
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    ButtonModule,
    ToastModule
  ],
  styleUrls: ['./add-stock.component.scss'],
  standalone: true,
})
export class AddStockComponent {
  stock = {
    name: '',
    code: '',
    amount: 0,
    category: '',
    price: 0,
    date: null,

    expire: null
  };

  categories = ['Food', 'Drink', 'Medicine', 'Cosmetic'];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) { }

  onSubmit() {
    if (this.stock.name && this.stock.code && this.stock.category) {
      console.log('✅ Stock added:', this.stock);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Stock added successfully'
      });

      setTimeout(() => {
        this.router.navigate(['/stock']);
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
    this.router.navigate(['/stock']);
  }
}
