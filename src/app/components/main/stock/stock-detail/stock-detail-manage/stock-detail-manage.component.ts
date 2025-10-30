import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { MODE_PAGE } from '../../../../../modules/common/common';
import { CommonModule } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { TranslateModule } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TablePageEvent } from 'primeng/table';
import { GlobalService } from '../../../../../services/global.service';
import { ProductData } from '../../../../../models/product-data';
import { ProductService } from '../../../../../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { DropdownService } from '../../../../../services/dropdown.service';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-stock-detail-manage',
  imports: [
    FormsModule,
    TableModule,
    CardModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    DatePicker,
    ButtonModule,
    ToastModule,
    TranslateModule,
    DialogModule,
    SelectModule,
  ],
  providers: [MessageService],
  templateUrl: './stock-detail-manage.component.html',
  styleUrl: './stock-detail-manage.component.scss',
})
export class StockDetailManageComponent implements OnInit {
  totalRecords: number = 0;
  rows: number = 5;
  currentTableData: ProductData[] = [];
  items: ProductData[] = [];
  itemCategory: ProductData[] = [];

  criteria: ProductData = {};

  mode: MODE_PAGE;

  params: string | null = null;

  constructor(
    private router: Router,
    private productService: ProductService,
    private globalService: GlobalService,
    private messageService: MessageService,

    private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    private route: ActivatedRoute,
    private readonly dropdownService: DropdownService
  ) {
    this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
  }

  ngOnInit() {
    this.params = this.route.snapshot.paramMap.get('id');
    console.log('params =', this.params);
    console.log('mode:', this.mode);

    this.getDropdownCategory();
    this.onSearch();


  }

  onSave() {
    this.loaderService.start();
    if (
      this.globalService.validate(this.criteria.name) ||
      this.globalService.validate(this.criteria.sku) ||
      this.globalService.validate(this.criteria.batchCode) ||
      this.globalService.validate(this.criteria.amount) ||
      this.globalService.validate(this.criteria.price) ||
      this.globalService.validate(this.criteria.receivedDate) ||
      this.globalService.validate(this.criteria.expireDate) ||
      this.globalService.validate(this.criteria.code)
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'เกิดข้อผิดพลาด',
        detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        life: 2000,
      });
      this.loaderService.stop();
    }

    setTimeout(() => {
      this.productService
        .saveProduct(this.criteria)
        .subscribe(({ status, message }) => {
          if (status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'สำเร็จ',
              detail: message,
              life: 2000,
            });
            if (this.mode == 'edit') {
      const sku = this.criteria.sku;
      console.log("sku =",sku);
      this.router.navigate([`/stock-detail-search/${sku}`]);
    } else if (this.mode == 'create') {
      this.router.navigate([`/stock-detail-search/${this.params}`]);
    }
            this.loaderService.stop();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'เกิดข้อผิดพลาด',
              detail: message,
              life: 2000,
            });
            this.loaderService.stop();
          }
        });
    }, 1500);
  }
  getDropdownCategory() {
    this.dropdownService
      .dropdownCategory(this.criteria)
      .subscribe(({ status, message, entries, totalRecords }) => {
        if (status === 200) {
          this.itemCategory = entries as ProductData[];
          this.totalRecords = totalRecords as number;
          console.log('item', this.itemCategory);
        } else {
          this.messageService.add({
            severity: 'error',
            summary:
              this.translate.instant('common.message.exception') || 'kkkk',
            detail: this.translate.instant(message as string) || message,
            life: 5000,
          });
        }
      });
  }

  onCancel() {
    if (this.mode == 'edit') {
      const sku = this.criteria.sku;
      console.log("sku =",sku);
      this.router.navigate([`/stock-detail-search/${sku}`]);
    } else if (this.mode == 'create') {
      this.router.navigate([`/stock-detail-search/${this.params}`]);
    }
  }

  onSearch(event?: TablePageEvent) {
    if (event) {
      this.criteria.size = event.rows;
      this.criteria.first = event.first;
    }
    this.rows = this.criteria.size ?? 5;

  if (this.mode == 'edit') {
  this.criteria.id = this.params !== null ? Number(this.params) : undefined;

  this.productService
    .findProductDetail(this.criteria)
    .subscribe(({ status, message, entries, totalRecords }) => {
      if (status === 200) {
        const data = entries as ProductData[];




        if (data.length > 0) {
          const p = data[0] as any;
          this.criteria = {
            ...p,
            receivedDate: p.receivedDate ? new Date(p.receivedDate) : null,
            expireDate: p.expireDate ? new Date(p.expireDate) : null,



          };
        }
        console.log('data edit', this.criteria);
      } else {
        this.messageService.add({
          severity: 'error',
          summary:
            this.translate.instant('common.message.exception') || 'kkkk',
          detail: this.translate.instant(message as string) || message,
          life: 5000,
        });
      }
    });
}
else if(this.mode == 'create'){
      this.criteria.sku = this.params ?? undefined;

          this.productService
      .findProductDetail(this.criteria)
      .subscribe(({ status, message, entries, totalRecords }) => {
        if (status === 200) {

        const data = entries as ProductData[];
        if (data.length > 0) {
          this.criteria = { ...data[0] };   
        }
          console.log('sku =', this.criteria);
          this.criteria.id = undefined;
          this.criteria.batchCode = undefined;
          this.criteria.amount = undefined;
          this.criteria.price = undefined;
          this.criteria.receivedDate = undefined;
          this.criteria.expireDate = undefined;
          console.log("check batchCode =",this.criteria.batchCode);

        } else {
          this.messageService.add({
            severity: 'error',
            summary:
              this.translate.instant('common.message.exception') || 'kkkk',
            detail: this.translate.instant(message as string) || message,
            life: 5000,
          });
        }
      });
    }



  }
}
