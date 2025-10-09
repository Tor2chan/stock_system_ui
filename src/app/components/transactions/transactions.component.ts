import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';


interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-transactions',
  standalone: true,      // ⚡ ทำให้เป็น standalone
  imports: [CommonModule, FormsModule, TableModule, Dialog, ButtonModule], // จำเป็นสำหรับ ngFor, ngClass, ngModel, pipe number
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  providers: [DecimalPipe]
})
export class TransactionsComponent {
  transactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  categories: string[] = [];

  selectedFilter: 'all' | 'income' | 'expense' = 'all';
  filterCategory: string = '';
  
  visibleEdit = false;

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor() {
    this.transactions = [
      { id: 1, date: '2025-10-08', category: 'Food', amount: 150, type: 'expense' },
      { id: 2, date: '2025-10-07', category: 'Salary', amount: 3000, type: 'income' },
      { id: 3, date: '2025-10-06', category: 'Transport', amount: 50, type: 'expense' },
      { id: 4, date: '2025-10-05', category: 'Bonus', amount: 500, type: 'income' },
      { id: 5, date: '2025-10-04', category: 'Shopping', amount: 200, type: 'expense' },
      { id: 6, date: '2025-10-03', category: 'Food', amount: 100, type: 'expense' },
      { id: 7, date: '2025-10-02', category: 'Salary', amount: 3000, type: 'income' },
      { id: 8, date: '2025-10-01', category: 'Entertainment', amount: 120, type: 'expense' }
    ];

    this.categories = Array.from(new Set(this.transactions.map(t => t.category)));
    this.updatePagination();
  }

  filterType(type: 'all' | 'income' | 'expense') {
    this.selectedFilter = type;
    this.page = 1;
    this.updatePagination();
  }

  filterByCategory() {
    this.page = 1;
    this.updatePagination();
  }

  updatePagination() {
    let filtered = this.transactions.filter(t => {
      const typeMatch = this.selectedFilter === 'all' || t.type === this.selectedFilter;
      const categoryMatch = !this.filterCategory || t.category === this.filterCategory;
      return typeMatch && categoryMatch;
    });

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.page - 1) * this.pageSize;
    this.paginatedTransactions = filtered.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }

  editTransaction(t: Transaction) {
    alert(`Edit transaction: ${t.id}`);
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure to delete this transaction?')) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.updatePagination();
    }
  }

  onOpenEdit(id: number){
    this.visibleEdit = true;
  }

  onCloseEdit(){
    this.visibleEdit = false;
  }

  onConfirmEdit(){

  }
}
