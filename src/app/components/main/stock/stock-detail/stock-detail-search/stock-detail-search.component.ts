
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog'; 
import { ButtonModule } from 'primeng/button';

import { MODE_PAGE } from '../../../../../modules/common/common';
import { TranslateModule} from '@ngx-translate/core';
import { TablePageEvent } from 'primeng/table';
import { GlobalService } from '../../../../../services/global.service';
import { ProductData } from '../../../../../models/product-data';
import { MessageService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../../../../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-stock-detail-search',
  imports: [ CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, TranslateModule , InputTextModule],
  standalone: true,
  templateUrl: './stock-detail-search.component.html',
  styleUrl: './stock-detail-search.component.scss',
  providers:[MessageService]
})
export class StockDetailSearchComponent implements OnInit{
 criteria:ProductData ={
  
 };

 items: ProductData[] = [];
 totalRecords:number = 0;
 rows: number = 5;

  categories: string[] = [];
  mode: MODE_PAGE= 'search';

  selectedFilter: 'all' | 'income' | 'expense' = 'all';
  filterCategory: string = '';
 
  visibleDelete = false;
  visibleCart = false;

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  params: string | null = null; 

  itemCategory: ProductData[] = [];
  itemDelete: ProductData = {}
  itemCart: ProductData = {}

  constructor(
    public readonly globalService:GlobalService,
    private readonly messageService:MessageService,
    private readonly productService:ProductService,
    private readonly loaderService: NgxUiLoaderService,
    private readonly translate : TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
      this.updatePagination();
      this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
  }
    ngOnInit() {
      this. params = this.route.snapshot.paramMap.get('id');
      console.log("sku = ",this.params)
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
        this.criteria.sku = this.params ?? undefined;

        this.productService.findProductDetail(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
          
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


   onSave(){
        this.loaderService.start();
        if (
            this.globalService.validate(this.itemCart.withdraw) 
          ){
            this.messageService.add({
                severity: 'warn',
                summary: 'เกิดข้อผิดพลาด',
                detail: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                life: 2000
            });
            console.log("xxxxxx");
            this.loaderService.stop();
            return;
          }

          setTimeout(() => {
            this.productService.withdrawProduct(this.itemCart).subscribe(({ status, message }) => {
            if (status === 200) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'สำเร็จ',
                    detail: message,
                    life: 2000
                    
                  });
            this.visibleCart = false;
            this.onSearch();
            this.loaderService.stop();
            } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'เกิดข้อผิดพลาด',
                    detail: message,
                    life: 2000
                  });
                  }
            this.loaderService.stop();
              });
        
          }, 1500);
      }

  updatePagination() {
    // let filtered = this.transactions.filter(t => {
    //   const typeMatch = this.selectedFilter === 'all' || t.type === this.selectedFilter;
    //   const categoryMatch = !this.filterCategory || t.category === this.filterCategory;
    //   return typeMatch && categoryMatch;
    // });

    // this.totalPages = Math.ceil(filtered.length / this.pageSize);
    // const start = (this.page - 1) * this.pageSize;
    // this.paginatedTransactions = filtered.slice(start, start + this.pageSize);
  }
  
  
    openPage(page: MODE_PAGE , data?: ProductData) {
  
      sessionStorage.setItem('mode', page);
  
      if (page === 'create') {
        this.router.navigate([`/stock-detail-manage-create/${(this.params)}`]);
      } else if (page === 'edit' && data?.id) {
        this.router.navigate([`/stock-detail-manage-edit/${(data.id)}`]);
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

  editTransaction(t: ProductData) {
    alert(`Edit transaction: ${t.id}`);
  }

  deleteTransaction(id: number) {
    // if (confirm('Are you sure to delete this transaction?')) {
    //   this.transactions = this.transactions.filter(t => t.id !== id);
    //   this.updatePagination();
    // }
  }
 
    onOpenDelete(item: ProductData){
        this.visibleDelete = true;
        this.itemDelete = structuredClone(item)
    }

    onCloseDelete(){
        this.visibleDelete = false;
    }

    onConfirmDelete(id: number){

        this.loaderService.start();
        setTimeout(() => {
        this.productService.deleteProduct(id).subscribe((result) => {
            if (result.status === 200) {
                this.messageService.add({
                    severity: 'success',
                    summary: 'สำเร็จ',
                    detail: result.message,
                    life: 2000
                });
                this.visibleDelete = false; 
                this.onSearch();
                this.loaderService.stop();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'ไม่สำเร็จ',
                    detail: result.message,
                    life: 3000
                });
                this.loaderService.stop();
            }
        });
        }, 1500);
    }

  onOpenCart(id: number) {
    this.visibleCart = true;
  }
    onCloseCart() {
    this.visibleCart = false;
  }



  onAdd() {
    this.router.navigate(['/stock-detail-manage']); 
  }
  onback() {
    this.router.navigate(['/stock-main-search']); 
  }
onCart(item: ProductData) {
  this.visibleCart = true;
  this.itemCart = structuredClone(item)


}


 exportExcel() {

  if (!this.items || this.items.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'No data to export'
    });
    return;
  }

  const exportData = this.items.map((item, index) => ({
    No: index + 1,
    Name: item.name ?? '',
    SKU: item.sku ?? '',
    Category: item.categoryName ?? '',
    Stock: item.sumAmount ?? 0
  }));

  const worksheet: XLSX.WorkSheet =
    XLSX.utils.json_to_sheet(exportData);

  const workbook: XLSX.WorkBook = {
    Sheets: { Stock: worksheet },
    SheetNames: ['Stock']
  };

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const data: Blob = new Blob([excelBuffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  const today = new Date();
  const fileName =
    `Stock_List_${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}.xlsx`;

  // ✅ ต้องเรียกแบบนี้
 saveAs(data, fileName);
}
  // onConfirmCart() {
  //   this.visibleCart = false;
  // }
}

