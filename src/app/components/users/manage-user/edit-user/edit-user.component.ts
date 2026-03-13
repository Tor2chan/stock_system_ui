import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { TablePageEvent } from 'primeng/table';
import { MODE_PAGE } from '../../../../modules/common/common';
import { UsersData } from '../../../../models/users-data';
import { UsersService } from '../../../../services/users.service';
import { GlobalService } from '../../../../services/global.service';
import { MessageService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, TranslateModule, InputTextModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  providers: [MessageService]
})
export class EditUserComponent implements OnInit {

  criteria: UsersData = {};
  items: UsersData[] = [];
  totalRecords: number = 0;
  rows: number = 5;

  visibleToggle = false;
  itemToggle: UsersData = {};

  mode: MODE_PAGE = 'edit';

  constructor(
    public readonly globalService: GlobalService,
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
    private readonly loaderService: NgxUiLoaderService,
    private readonly translate: TranslateService,
    private router: Router
  ) {
    this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
  }

  ngOnInit() {
    this.onSearch();
  }

  onSearch(event?: TablePageEvent) {
    if (event) {
      this.criteria.size = event.rows;
      this.criteria.first = event.first;
      if (event.rows != this.rows) this.globalService.backToFirstPage();
    } else {
      this.globalService.backToFirstPage();
    }
    this.rows = this.criteria.size ?? 5;
    this.usersService.find(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
      if (status === 200) {
        this.items = entries as UsersData[];
        this.totalRecords = totalRecords as number;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('common.message.exception') || 'Error',
          detail: this.translate.instant(message as string) || message,
          life: 5000
        });
      }
    });
  }

  // ⭐ เปิด dialog ยืนยัน
  onToggleStatus(item: UsersData) {
    this.itemToggle = structuredClone(item);
    this.visibleToggle = true;
  }

  onCloseToggle() {
    this.visibleToggle = false;
  }

  // ⭐ ยืนยันแล้ว call API
  onConfirmToggle() {
    this.loaderService.start();
    setTimeout(() => {
      this.usersService.toggleStatus(this.itemToggle.id!).subscribe((result) => {
        if (result.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.itemToggle.active ? 'User deactivated' : 'User activated',
            life: 2000
          });
          this.visibleToggle = false;
          this.onSearch();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: result.message,
            life: 3000
          });
        }
        this.loaderService.stop();
      });
    }, 800);
  }

  onBack() {
    this.router.navigate(['/stock-main-search']);
  }

  openPage(page: MODE_PAGE, data?: UsersData) {
    sessionStorage.setItem('mode', page);
    if (page === 'create') {
      this.router.navigate(['/add-user-create']);
    } else if (page === 'edit' && data?.id) {
      this.router.navigate([`/add-user-edit/${data.id}`]);
    }
  }
}