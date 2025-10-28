import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog'; // ✅ ใช้ DialogModule ไม่ใช่ Dialog
import { ButtonModule } from 'primeng/button';
import { MODE_PAGE } from '../../../../../modules/common/common';
import { TranslateModule} from '@ngx-translate/core';
import { TablePageEvent } from 'primeng/table';
import { GlobalService } from '../../../../../services/global.service';
import { ProductData } from '../../../../../models/product-data';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../../../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../../interceptors/jwt.interceptor';

@Component({
  selector: 'app-stock-main-search',
  imports: [ CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, TranslateModule,],
standalone: true,
  templateUrl: './stock-main-search.component.html',
  styleUrl: './stock-main-search.component.scss',
  providers: [MessageService]

})
export class StockMainSearchComponent implements OnInit{

 criteria:ProductData ={
 };

 items: ProductData[] = [];
 totalRecords:number = 0;
 rows: number = 5;

  categories: string[] = [];
  mode: MODE_PAGE= 'search';

  selectedFilter: 'all' | 'income' | 'expense' = 'all';
  filterCategory: string = '';
  visibleEdit = false;

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    public readonly globalService:GlobalService,
    private readonly messageService:MessageService,
    private readonly productService:ProductService,
    private readonly translate : TranslateService,

    private router: Router
  ) {
    // ✅ กำหนดข้อมูลตัวอย่าง
 

    // this.categories = Array.from(new Set(this.transactions.map(t => t.category)));
    this.updatePagination();
     this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
  }

  ngOnInit() {
    this.onSearch();
  }

  onSearch(event?: TablePageEvent) {
        
        if (event) {
            this.criteria.size = event.rows;
            this.criteria.first = event.first;
            if (event.rows != this.rows) {
                this.globalService.backToFirstPage();
            }
        } else {
            this.globalService.backToFirstPage();
        }

        this.rows = this.criteria.size ?? 5;

        this.productService.findProduct(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
          
            if (status === 200) {

                this.items = entries as ProductData[];
                this.totalRecords = totalRecords as number;
               console.log('item',this.items);
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
   
  }

  
    // openPage(page: MODE_PAGE , data?: Transactio) {
  
    //   sessionStorage.setItem('mode', page);
  
    //   if (page === 'create') {
    //       this.router.navigate(['/stock-main-manage-create']);
    //   } else if (page === 'edit' && data?.id) {
  
    //       this.router.navigate([`/stock-main-manage-edit/${(data.id)}`]);
  
    //   }
    // }

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

  // editTransaction(t: Transaction) {
  //   alert(`Edit transaction: ${t.id}`);
  // }

  // deleteTransaction(id: number) {
  //   if (confirm('Are you sure to delete this transaction?')) {
  //     this.transactions = this.transactions.filter(t => t.id !== id);
  //     this.updatePagination();
  //   }
  // }

  onOpenEdit(id: number) {
    this.visibleEdit = true;
  }

  onCloseDelete() {
    this.visibleEdit = false;
  }

  onAdd(){
    this.router.navigate(['/stock-main-manage']); 
  }
 
  ondetail(sku: ProductData) {
    console.log(sku)
    this.router.navigate([`/stock-detail-search/${(sku)}`]);
  }

 onDelete(id: number) {
    this.visibleEdit = true;
  }
 onDeleteConfirm() {
   
 }
    openPage(page: MODE_PAGE , data?: ProductData) {
  
      sessionStorage.setItem('mode', page);
  
      if (page === 'create') {
          this.router.navigate(['/stock-main-manage-create']);
      } else if (page === 'edit' && data?.id) {
  
          this.router.navigate([`/stock-main-manage-edit/${(data.id)}`]);
  
      }
    }
}

