import { Component } from '@angular/core';
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
import { TranslateModule} from '@ngx-translate/core';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog'; 
import { TablePageEvent } from 'primeng/table';
import { GlobalService } from '../../../../../services/global.service';
import { ProductData } from '../../../../../models/product-data';
import { ProductService } from '../../../../../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-stock-detail-manage',
  imports: [ FormsModule, TableModule,CardModule,CommonModule, InputTextModule, DropdownModule, InputNumberModule, 
            DatePicker, ButtonModule, ToastModule,TranslateModule, DialogModule],
  providers: [MessageService],
  templateUrl: './stock-detail-manage.component.html',
  styleUrl: './stock-detail-manage.component.scss',
})
export class StockDetailManageComponent {

  mode: MODE_PAGE;
  categories = ['Food', 'Drink', 'Medicine', 'Cosmetic'];

  criteria:ProductData ={};

  items: ProductData[] = [];
  totalRecords:number = 0;
  rows: number = 5;
  params: string | null = null; 


  constructor(
    private router: Router,
    private messageService: MessageService,
    public readonly globalService:GlobalService,
    private readonly productService:ProductService,
    private readonly translate : TranslateService,
    private route: ActivatedRoute
  ) {  this.mode = <MODE_PAGE>sessionStorage.getItem('mode') ?? 'search';}


  ngOnInit() {
      this. params = this.route.snapshot.paramMap.get('id');
      this.onSearch();
    }

    onCancel() {
      if(this.mode == 'edit'){
        const sku = this.items[0]?.sku;
        this.router.navigate([`/stock-detail-search/${(sku)}`]);
      }else if(this.mode == 'create'){
        this.router.navigate([`/stock-detail-search/${(this.params)}`]);
      }
    }

  onSearch(event?: TablePageEvent) {
        if (event) {
            this.criteria.size = event.rows;
            this.criteria.first = event.first;
        }
        this.rows = this.criteria.size ?? 5;
        this.criteria.id = this.params !== null ? Number(this.params) : undefined;
        this.productService.findProductDetail(this.criteria).subscribe(({ status, message, entries, totalRecords }) => {
          
            if (status === 200) {

                this.items = entries as ProductData[];
                this.totalRecords = totalRecords as number;
                console.log('item',this.items);
                console.log("sku =", this.items[0]?.sku)
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
    onSave(){

    }
}

