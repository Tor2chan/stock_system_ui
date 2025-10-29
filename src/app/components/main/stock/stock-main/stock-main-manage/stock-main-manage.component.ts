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
import { GlobalService } from '../../../../../services/global.service';

import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

import { ProductData } from '../../../../../models/product-data';
import { ProductService } from '../../../../../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TablePageEvent } from 'primeng/table';

import { ActivatedRoute } from '@angular/router';
import { DropdownService } from '../../../../../services/dropdown.service';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
@Component({
  selector: 'app-stock-main-manage',
  imports: [FormsModule, CardModule, CommonModule, InputTextModule, SelectModule, InputNumberModule, ButtonModule, ToastModule, TranslateModule, DatePicker],
  providers: [MessageService],
  
  templateUrl: './stock-main-manage.component.html',
  styleUrl: './stock-main-manage.component.scss'
})
export class StockMainManageComponent  implements OnInit {

   totalRecords:number = 0;
    rows: number = 5;
   currentTableData: ProductData[] = [];
    items: ProductData[] = []
    itemCategory: ProductData[] = [];
 
   criteria : ProductData =  {
     
   }
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
    private readonly dropdownService: DropdownService,

  ) { this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search'; }

  
    ngOnInit() {
      this. params = this.route.snapshot.paramMap.get('id');
      console.log("params =", this.params)
      console.log('mode:', this.mode)
      this.getDropdownCategory();
      
    }


     onSave(){
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
            
          ){
            this.messageService.add({
                severity: 'warn',
                summary: 'เกิดข้อผิดพลาด',
                detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                life: 2000
            });
          this.loaderService.stop();
          }

          setTimeout(() => {
            this.productService.saveProduct(this.criteria).subscribe(({ status, message }) => {
            if (status === 200) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'สำเร็จ',
                    detail: message,
                    life: 2000
                    
                  });
            this.router.navigate(['/stock-main-search']);
            this.loaderService.stop();
            } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'เกิดข้อผิดพลาด',
                    detail: message,
                    life: 2000
                  });
            this.loaderService.stop();
                  }
              });
        
          }, 1500);

      }


      getDropdownCategory(){
    this.dropdownService.dropdownCategory(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
        
        if (status === 200) {
            this.itemCategory = entries as ProductData[];
            this.totalRecords = totalRecords as number;
            console.log('item',this.itemCategory);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: this.translate.instant('common.message.exception') || 'kkkk',
                detail: this.translate.instant(message as string) || message,
                life: 5000
            });
        }
    });
  }
      
              
  onCancel() {
    this.router.navigate(['/stock-main-search']);

  }
  onManageCategory() {
    this.router.navigate(['/category-search']);
  }
}
