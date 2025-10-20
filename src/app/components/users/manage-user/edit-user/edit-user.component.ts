import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { MODE_PAGE } from '../../../../modules/common/common';

interface User {
  id: number;
  user: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, TranslateModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  users: User[] = [];
  visibleEdit = false;
  selectedUser: User | null = null;
  sortField: keyof User | null = null;
  sortOrder: 'asc' | 'desc' | null = null;
  mode: 'edit' | 'create' = 'edit';

  constructor(private router: Router) {
    // ตัวอย่างข้อมูล
    this.users = [
      { id: 1, user: 'Pond', name: 'Pond99', role: 'Admin', status: 'Active' },
      { id: 2, user: 'Beer', name: 'Beer99', role: 'User', status: 'Inactive' },
      { id: 3, user: 'Tor', name: 'Tor99', role: 'Admin', status: 'Active' }
    ];
  }

  onSearch() {
    // TODO: เพิ่ม logic search
  }


  deleteTransaction(id: number) {
    if (confirm('Are you sure to delete this user?')) {
      this.users = this.users.filter(u => u.id !== id);
    }
  }

  onCloseEdit() {
    this.visibleEdit = false;
    this.selectedUser = null;
  }

  onConfirmEdit() {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index > -1) {
        this.users[index] = { ...this.selectedUser };
      }
      this.onCloseEdit();
    }

  }
  openPage(page: MODE_PAGE, data?: User) {

    sessionStorage.setItem('mode', page);

    if (page === 'create') {
      this.router.navigate(['/add-user-create']);
    } else if (page === 'edit' && data?.id) {

      this.router.navigate([`/add-user-edit/${(data.id)}`]);

    }
  }

  sortTable(field: keyof User, order: 'asc' | 'desc') {
    this.sortField = field;
    this.sortOrder = order;
    this.users = [...this.users].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
  goback() {
    this.router.navigate(['/stock-main-search']); 
  }
}
