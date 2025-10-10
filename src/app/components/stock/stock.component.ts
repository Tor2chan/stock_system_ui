import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';


interface Transaction {
  id: number;
  name: string;
  code: string;
  price: number | string;
  expire: string;

  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, Dialog, ButtonModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})

export class StockComponent {
  transactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  categories: string[] = [];

  selectedFilter: 'all' | 'income' | 'expense' = 'all';
  filterCategory: string = '';

  visibleEdit = false;

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  onSearch() { }

  constructor() {
    this.transactions = [
      { id: 1, name: 'Coke', code: '049-219-1', amount: 150, category: 'Food', price: '10000', date: '2025-10-08', expire: '2025-10-08', type: 'expense' },
      { id: 2, name: 'Pepsi', code: '049-219-2', amount: 3000, category: 'Salary', price: '20000', date: '2025-10-07', expire: '2025-10-07', type: 'income' },
      { id: 3, name: 'Fanta', code: '049-219-3', amount: 50, category: 'Transport', price: '30000', date: '2025-10-06', expire: '2025-10-06', type: 'expense' },

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

  onOpenEdit(id: number) {
    this.visibleEdit = true;
  }

  onCloseEdit() {
    this.visibleEdit = false;
  }

  onConfirmEdit() {

  }
  onAdd() {
    alert('Add new stock item');
  }
}

