import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog'; // ✅ ใช้ DialogModule ไม่ใช่ Dialog
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MODE_PAGE } from '../../../../../modules/common/common';
import { TranslateModule} from '@ngx-translate/core';
import { TablePageEvent } from 'primeng/table';
import { GlobalService } from '../../../../../services/global.service';
import { ProductData } from '../../../../../models/product-data';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ProductService } from '../../../../../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../../interceptors/jwt.interceptor';
import { CategoryData } from '../../../../../models/catagory-data';
import { DropdownService } from '../../../../../services/dropdown.service';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-stock-main-search',
  imports: [ CommonModule, FormsModule, TableModule, DialogModule,SelectModule, ButtonModule, TranslateModule, InputTextModule],
standalone: true,
  templateUrl: './stock-main-search.component.html',
  styleUrl: './stock-main-search.component.scss',
  providers: [MessageService]

})
export class StockMainSearchComponent implements OnInit{

 criteria:ProductData ={
    code: ""

 };

  itemCategory: ProductData[] = [];
  selectedCategory: string | null = null;


 items: ProductData[] = [];
 totalRecords:number = 0;
 rows: number = 5;

  categories: string[] = [];
  mode: MODE_PAGE= 'search';

  selectedFilter: 'all' | 'income' | 'expense' = 'all';
  filterCategory: string = '';
  visibleEdit = false;
  visibleDelete = false;

  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    public readonly globalService:GlobalService,
    private readonly messageService:MessageService,
    private readonly productService:ProductService,
    private readonly translate : TranslateService,
    private readonly dropdownService: DropdownService,
    private router: Router
  ) {
  
     this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';
  }

  ngOnInit() {
    this.getDropdownCategory();
    this.onSearch();
  }

  onSearch(event?: TablePageEvent) {
        console.log("code :" ,this.criteria.code)
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
                    summary: this.translate.instant('common.message.exception'),
                    detail: this.translate.instant(message as string) || message,
                    life: 5000
                });
            }
        });
    }
onclear(){
  this.criteria = {
    name: "",
    sku: "",
    code: ""
  };
  this.onSearch();
}




  onManageCategory() {
    this.router.navigate(['/category-search']); 
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

  

  onOpenEdit(id: number) {
    this.visibleEdit = true;
  }

  onDelete(id: number) {
    this.visibleDelete = true;
  }
  onCloseDelete() {
    this.visibleDelete = false;
  }

  onAdd(){
    this.router.navigate(['/stock-main-manage']); 
  }
 
  ondetail(sku: ProductData) {
    console.log(sku)
    this.router.navigate([`/stock-detail-search/${(sku)}`]);
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

