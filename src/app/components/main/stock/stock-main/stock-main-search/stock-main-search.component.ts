import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog'; // ✅ ใช้ DialogModule ไม่ใช่ Dialog
import { ButtonModule } from 'primeng/button';
import { MODE_PAGE } from '../../../../../modules/common/common';

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
  selector: 'app-stock-main-search',
  imports: [ CommonModule, FormsModule, TableModule, DialogModule, ButtonModule],
standalone: true,
  templateUrl: './stock-main-search.component.html',
  styleUrl: './stock-main-search.component.scss'
})
export class StockMainSearchComponent {
  transactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  categories: string[] = [];
  mode: MODE_PAGE= 'search';

  selectedFilter: 'all' | 'income' | 'expense' = 'all';
  filterCategory: string = '';
  visibleEdit = false;

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private router: Router
  ) {
    // ✅ กำหนดข้อมูลตัวอย่าง
    this.transactions = [
      { id: 1, name: 'Coke', code: '049-219-1', amount: 150, category: 'Food', price: '10000', date: '2025-10-08', expire: '2025-10-08', type: 'expense' },
      { id: 2, name: 'Pepsi', code: '049-219-2', amount: 3000, category: 'Salary', price: '20000', date: '2025-10-07', expire: '2025-10-07', type: 'income' },
      { id: 3, name: 'Fanta', code: '049-219-3', amount: 50, category: 'Transport', price: '30000', date: '2025-10-06', expire: '2025-10-06', type: 'expense' },
      { id: 3, name: 'Fanta', code: '049-219-3', amount: 50, category: 'Transport', price: '30000', date: '2025-10-06', expire: '2025-10-06', type: 'expense' },
      { id: 3, name: 'Fanta', code: '049-219-3', amount: 50, category: 'Transport', price: '30000', date: '2025-10-06', expire: '2025-10-06', type: 'expense' },
      { id: 3, name: 'Fanta', code: '049-219-3', amount: 50, category: 'Transport', price: '30000', date: '2025-10-06', expire: '2025-10-06', type: 'expense' },
      { id: 3, name: 'Fanta', code: '049-219-3', amount: 50, category: 'Transport', price: '30000', date: '2025-10-06', expire: '2025-10-06', type: 'expense' },
      { id: 3, name: 'Fanta', code: '049-219-3', amount: 50, category: 'Transport', price: '30000', date: '2025-10-06', expire: '2025-10-06', type: 'expense' },
      
    ];

    this.categories = Array.from(new Set(this.transactions.map(t => t.category)));
    this.updatePagination();
     this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
  }

  onSearch() {}
  onManageCategory() {
    this.router.navigate(['/category-search']); 
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
   ngOnInit() {
  
      }
  
    openPage(page: MODE_PAGE , data?: Transaction) {
  
      sessionStorage.setItem('mode', page);
  
      if (page === 'create') {
        console.log ("oooo")
          this.router.navigate(['/stock-main-manage-create']);
      } else if (page === 'edit' && data?.id) {
  
          this.router.navigate([`/stock-main-manage-edit/${(data.id)}`]);
  
      }
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
    // TODO: Implement update logic
  }

  onAdd() {
    this.router.navigate(['/stock-main-manage']); 
  }
}

