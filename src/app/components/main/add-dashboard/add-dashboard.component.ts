import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

interface Transaction {
  id?: number;
  date: string;
  category: string;
  amount: number;
  type: string;
  description?: string;
}

// Mock service
class TransactionService {
  private data: Transaction[] = [];

  getTransactionById(id: number) {
    return {
      subscribe: (callback: any) => {
        const found = this.data.find(d => d.id === id);
        callback(found);
      }
    };
  }

  addTransaction(tx: Transaction) {
    tx.id = this.data.length + 1;
    this.data.push(tx);
    console.log('Added:', tx);
    return { subscribe: (callback: any) => callback(tx) };
  }

  updateTransaction(id: number, tx: Transaction) {
    const idx = this.data.findIndex(d => d.id === id);
    if (idx > -1) this.data[idx] = { ...tx, id };
    console.log('Updated:', this.data[idx]);
    return { subscribe: (callback: any) => callback(tx) };
  }
}

@Component({
  selector: 'app-add-dashboard',
  standalone: true,
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    InputTextModule,
    ToastModule,
    DividerModule
  ],
  providers: [MessageService]
})
export class AddDashboardComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  editId: number | null = null;
  processing: boolean = false;

  private fb = inject(FormBuilder);
  private msg = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private txService = new TransactionService();

  categoryOptions = [
    { label: 'Food / อาหาร', value: 'Food' },
    { label: 'Transport / เดินทาง', value: 'Transport' },
    { label: 'Rent / ค่าเช่า', value: 'Rent' },
    { label: 'Salary / เงินเดือน', value: 'Salary' },
    { label: 'Other / อื่นๆ', value: 'Other' }
  ];

  typeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [new Date(), Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['']
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEdit = true;
        this.editId = +id;
        this.txService.getTransactionById(this.editId).subscribe((tx: Transaction | undefined) => {
          if (tx) {
            this.form.patchValue({
              date: new Date(tx.date),
              category: tx.category,
              type: tx.type,
              amount: tx.amount,
              description: tx.description
            });
          }
        });
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.msg.add({ severity: 'warn', summary: 'Validation', detail: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      return;
    }

    this.processing = true; // เพิ่มการกำหนด processing

    const fv = this.form.value;
    const payload: Transaction = {
      date: fv.date.toISOString().split('T')[0],
      category: fv.category,
      amount: fv.amount,
      type: fv.type,
      description: fv.description
    };

    const callback = () => {
      this.processing = false;
      this.router.navigate(['/main-dashboard']);
    };

    if (this.isEdit && this.editId) {
      this.txService.updateTransaction(this.editId, payload).subscribe(() => {
        this.msg.add({ severity: 'success', summary: 'Updated', detail: 'อัปเดตเรียบร้อย' });
        callback();
      });
    } else {
      this.txService.addTransaction(payload).subscribe(() => {
        this.msg.add({ severity: 'success', summary: 'Saved', detail: 'บันทึกเรียบร้อย' });
        callback();
      });
    }
  }

  cancel() {
    this.router.navigate(['/main-dashboard']);
  }

  onSubmit(): void {
    this.save();
  }

  // 🔹 สร้าง alias ให้ template ใช้ได้
  onSave(): void {
    this.save();
  }

  onBack(): void {
    this.cancel();
  }
}
